const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const saltRounds = 10;
const jwtSecret = "jwt-secret-key";

//middleware
app.use(cors({
    origin: "http://localhost:3000", // Ensure this matches your frontend port
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


//routes

//get districts when the state is chosen
app.get('/districts', async(req, res) => {
    try {
        const { state } = req.query;
        const result = await pool.query('SELECT district FROM colleges WHERE state = $1', [state]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// get colleges when the district is chosen
app.get('/colleges', async(req, res) => {
    try {
       const { district } = req.query;

        // Use a query with conditional logic
        const query = district 
            ? 'SELECT college_name FROM colleges WHERE district = $1' 
            : 'SELECT distinct(college_name) FROM colleges';

        // Execute the query with or without the district parameter
        const params = district ? [district] : [];
        const result = await pool.query(query, params);

        res.json(result.rows); 
    } catch (err) {
        console.error(err.message)
    }
})


// Route to handle adding a new college
app.post('/addcollege', async (req, res) => {
    try {
        const { college_name, state, district, established_year } = req.body;

        // Insert the new college into the database
        const query = `
            INSERT INTO colleges (college_name, state, district, established_year) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [college_name, state, district, established_year];

        // Execute the query
        const result = await pool.query(query, values);

        // Send back the inserted college details as a response
        res.status(201).json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add college' });
    }
});

// college details for adming page
app.get('/colleges-admin', async (req, res) => {
    try {
        // Query to fetch all columns from the colleges table
        const query = 'SELECT * FROM colleges';
        
        // Execute the query without any parameters
        const result = await pool.query(query);

        // Send back all rows from the table as JSON
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// get departments when the colleges is chosen

app.get('/departments', async(req, res) =>{
    try {
        const { college } = req.query;
        let query;
        let params = [];
        if (college) {
            const collegeResult = await pool.query('SELECT college_id FROM colleges WHERE college_name = $1', [college]);
            const collegeId = collegeResult.rows[0]?.college_id;
            query = 'SELECT department_name FROM departments WHERE college_id = $1';
            params = [collegeId];

        } else {
            query = 'SELECT distinct(department_name) FROM departments';
        }

        const departmentsResult = await pool.query(query, params);
        res.json(departmentsResult.rows);
    } catch (err) {
        console.error(err.message);        
    }
})

// Endpoint to add a new department
app.post('/adddepartment', async (req, res) => {
    const { department_name, college_name } = req.body;

    // Input validation
    if (!department_name || !college_name) {
        return res.status(400).json({ message: 'Department name and College name are required' });
    }

    try {
        // Find college_id based on college_name
        const collegeResult = await pool.query(
            'SELECT college_id FROM colleges WHERE college_name = $1',
            [college_name]
        );

        if (collegeResult.rows.length === 0) {
            return res.json({ message: 'College not found' });
        }

        const college_id = collegeResult.rows[0].college_id;

        // Check if a department with the same name already exists for this college
        const existingDepartment = await pool.query(
            'SELECT * FROM departments WHERE department_name = $1 AND college_id = $2',
            [department_name, college_id]
        );

        if (existingDepartment.rows.length > 0) {
            return res.json({ message: 'Department already exists for this college' });
        }

        // Insert into departments table
        const result = await pool.query(
            'INSERT INTO departments (department_name, college_id) VALUES ($1, $2) RETURNING *',
            [department_name, college_id]
        );

        // Send response
        res.status(201).json({
            message: 'Department added successfully',
            department: result.rows[0],
        });
    } catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






// posting job

app.post('/jobpost', async(req, res) => {
    try {
        {/*(job_title, 
            job_description, 
            eligibility, 
            department_id, 
            gov_order_id) */}
        const {jobTitle,jobDescription,eligibility,collegeName,depName,orderNo}=req.body;
        const collegeResult = await pool.query('select college_id from colleges where college_name = $1',[collegeName]);
        const collegeId = collegeResult.rows[0]?.college_id;
        const departmentResult = await pool.query('select department_id from departments where college_id = $1 and department_name = $2',[collegeId,depName]);
        const departmentId = departmentResult.rows[0]?.department_id;
        const newJobPost = await pool.query(
            "INSERT INTO job_posts (job_title, job_description, eligibility, department_id, gov_order_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
            [jobTitle, jobDescription, eligibility, departmentId,orderNo]
        );
        res.json(newJobPost.rows);
    } catch (err) {
        console.error(err.message);
        
    }
})


// display college job post details


app.get('/jobs-count', async (req, res) => {
    try {
        const { district, collegeName, departmentName, jobTitle } = req.query;

        // Base query
        let query = `
            SELECT c.college_name, d.department_name, jp.job_title, COUNT(jp.job_id) AS job_count
            FROM job_posts jp
            JOIN departments d ON jp.department_id = d.department_id
            JOIN colleges c ON d.college_id = c.college_id
            WHERE 1=1`;

        // Array to hold query parameters
        let params = [];

        // Add conditions based on input parameters
        if (district) {
            query += ` AND c.district = $${params.length + 1}`;
            params.push(district);
        }
        if (collegeName) {
            query += ` AND c.college_name = $${params.length + 1}`;
            params.push(collegeName);
        }
        if (departmentName) {
            query += ` AND d.department_name = $${params.length + 1}`;
            params.push(departmentName);
        }
        if (jobTitle) {
            query += ` AND jp.job_title = $${params.length + 1}`;
            params.push(jobTitle);
        }

        query += `
            GROUP BY c.college_name, d.department_name, jp.job_title
            ORDER BY c.college_name, d.department_name, jp.job_title;`;

        // Execute the query
        const result = await pool.query(query, params);

        // Return the result
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// getting dititnc job titles
app.get('/job-title', async(req,res) =>{
    try {
        const result = await pool.query('select distinct(job_title) from job_posts');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(sql, [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Compare the password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ name: user.name, role: user.role }, jwtSecret, { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false, // Set true if using HTTPS in production
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                });

                res.json({ Status: "Success", Role: user.role });
            } else {
                res.json({ Error: "Password does not match" });
            }
        } else {
            res.json({ Error: "No user found with this email" });
        }
    } catch (error) {
        console.error(error);
        res.json({ Error: "Login error" });
    }
});

// registration for admin
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)';
        await pool.query(sql, [name, email, hashedPassword, role]);
        res.json({ Status: "User Registered" });
    } catch (error) {
        console.error(error);
        res.json({ Error: "Error registering user" });
    }
});

// Check Authentication Route
app.get('/check-auth', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ Status: "Not Authenticated" });

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return res.status(403).json({ Status: "Invalid Token" });

        res.json({ Status: "Authenticated", Role: decoded.role });
    });
});

//get user informations
app.get('/users', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message)
    }
})

// DELETE endpoint to remove a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Execute the DELETE query
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        // Check if any row was deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});
app.delete('/colleges/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM colleges WHERE college_id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'College not found' });
        }
        
        res.status(200).json({ message: 'College deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// update user endpoint
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information
        const updateQuery = `
            UPDATE users
            SET name = $1, email = $2, role = $3
            WHERE id = $4
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [name, email, role, id]);

        // Return the updated user
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update a college
app.put("/colleges/:college_id", async (req, res) => {
  const { college_id } = req.params;
  const { college_name, state, district, established_year } = req.body;

  try {
    // SQL query to update the college data
    const updateCollegeQuery = `
      UPDATE colleges
      SET college_name = $1, state = $2, district = $3, established_year = $4
      WHERE college_id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateCollegeQuery, [
      college_name,
      state,
      district,
      established_year,
      college_id,
    ]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send updated college data back
    } else {
      res.status(404).json({ error: "College not found" });
    }
  } catch (err) {
    console.error("Error updating college:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});










app.listen(5000, () => {
    console.log("server has started on 5000");
});
import React, { Fragment, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const JobForm = () => {
    // State for form fields
    const [state, setState] = useState('Kerala'); // default state
    const [district, setDistrict] = useState('');
    const [college, setCollege] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [eligibility, setEligibility] = useState('');
    const navigate = useNavigate(); 

    // State for dropdown options
    const [districts, setDistricts] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Fetch districts when the state changes
    useEffect(() => {
        async function fetchDistricts() {
            try {
                const response = await fetch(`http://localhost:5000/districts?state=${state}`, {
                    method: 'GET',
                });
                const data = await response.json();
                setDistricts(data);
                if (data.length > 0) {
                    setDistrict(data[0].district); // Select the first district by default
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        }
        fetchDistricts();
    }, [state]);

    // Fetch colleges when the district changes
    useEffect(() => {
        if (!district) return;
        async function fetchColleges() {
            try {
                const response = await fetch(`http://localhost:5000/colleges?district=${district}`);
                const data = await response.json();
                setColleges(data);
                if (data.length > 0) {
                    setCollege(data[0].college_name); // Select the first college by default
                }
            } catch (error) {
                console.error("Error fetching colleges:", error);
            }
        }
        fetchColleges();
    }, [district]);

    // Fetch departments when the college changes
    useEffect(() => {
        if (!college) return;
        async function fetchDepartments() {
            try {
                const response = await fetch(`http://localhost:5000/departments?college=${college}`);
                const data = await response.json();
                setDepartments(data);
                if (data.length > 0) {
                    setDepartmentId(data[0].department_id); // Select the first department by default
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        }
        fetchDepartments();
    }, [college]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            jobTitle,
            jobDescription,
            eligibility,
            collegeName: college,  // Renamed to match the server's expected field
            depName: departmentId,
            orderNo
        };

        try {
            const response = await fetch('http://localhost:5000/jobpost', { // Ensure this matches your backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || 'Job post added successfully!');
                // Reset form fields if needed
                setJobTitle('');
                setJobDescription('');
                setEligibility('');
                setOrderNo('');
                setDistrict('');
                setCollege('');
                setDepartmentId('');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Error posting job. Please try again.");
        }
    };

    const handleLogout = async () => {
  try {
    // Make a request to your backend to log out the user
    
    // Redirect the user to the login page or a landing page
    navigate("/"); // or navigate to a landing page
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

    return (
        <Fragment>
        <nav
        className="navbar navbar-expand-lg navbar-light bg-primary"
        style={{ background: "#2F71C4" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand text-white font-weight-bolder" href="#">
            DTE
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to={"/home"} className="btn btn-primary">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/showjob"} className={`btn btn-primary`}>
            Show jobs
        </Link>

              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fas fa-user"></i> Switch User
                </a>
              </li>
              <li className="nav-item">
  <a className="nav-link text-white" href="#" onClick={handleLogout}>
    <i className="fas fa-sign-out-alt"></i> Logout
  </a>
</li>
            </ul>
          </div>
        </div>
      </nav>
            <div className="container-fluid p-0" >
                <div className="row justify-content-center" >
                    <div className="col-md-6">
                        <div className="card shadow-lg p-4 mt-5"
                        >
                            <div className="card-body">
                                <h1 className="text-center mb-4">New Job Posting Form</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="order_no" className="form-label">Order No:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="order_no"
                                            value={orderNo}
                                            onChange={(e) => setOrderNo(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="state" className="form-label">State:</label>
                                        <select
                                            id="state"
                                            className="form-select"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option value="Kerala">Kerala</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="district" className="form-label">District:</label>
                                        <select
                                            id="district"
                                            className="form-select"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                        >
                                            <option value="">Select a District</option>
                                            {districts.map((d, index) => (
                                                <option key={index} value={d.district}>{d.district}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="college" className="form-label">College:</label>
                                        <select
                                            id="college"
                                            className="form-select"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                        >
                                            <option value="">Select a College</option>
                                            {colleges.map((c, index) => (
                                                <option key={index} value={c.college_name}>{c.college_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="department_id" className="form-label">Department:</label>
                                        <select
                                            id="department_id"
                                            className="form-select"
                                            value={departmentId}
                                            onChange={(e) => setDepartmentId(e.target.value)}
                                        >
                                            <option value="">Select a Department</option>
                                            {departments.map((d, index) => (
                                                <option key={index} value={d.department_id}>{d.department_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="job_title" className="form-label">Job Title:</label>
                                        <select
                                            id="job_title"
                                            className="form-select"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a Job Title</option>
                                            <option value="Associate Professor">Associate Professor</option>
                                            <option value="Assistant Librarian">Assistant Librarian</option>
                                            <option value="Lab Assistant">Lab Assistant</option>
                                            <option value="Workshop Instructor">Workshop Instructor</option>
                                            <option value="Technical Assistant">Technical Assistant</option>
                                            <option value="Librarian">Librarian</option>
                                            <option value="Research Associate">Research Associate</option>
                                            <option value="Lecturer">Lecturer</option>
                                            <option value="Senior Lecturer">Senior Lecturer</option>
                                            <option value="Assistant Professor">Assistant Professor</option>
                                            <option value="Lab Technician">Lab Technician</option>
                                            <option value="Professor">Professor</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="job_description" className="form-label">Job Description:</label>
                                        <textarea
                                            id="job_description"
                                            className="form-control"
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            rows="3"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="eligibility" className="form-label">Eligibility:</label>
                                        <textarea
                                            id="eligibility"
                                            className="form-control"
                                            value={eligibility}
                                            onChange={(e) => setEligibility(e.target.value)}
                                            rows="3"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Add Job Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default JobForm;

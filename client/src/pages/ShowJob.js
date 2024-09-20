import React, { Fragment, useState, useEffect } from "react";
import { Dropdown, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShowJob = () => {
  // state for select fields
  const [state, setState] = useState("Kerala");
  const [district, setDistrict] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [jobrole, setJobrole] = useState("");
  const navigate = useNavigate();

  // state for storing database details
  const [colleges, setColleges] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobs, setJobs] = useState([]);

  //fetching districs
  useEffect(() => {
    async function fetchDistricts() {
      try {
        const response = await fetch(
          `http://localhost:5000/districts?state=${state}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        //console.log(data);
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

  //fetching colleges
  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch(
          `http://localhost:5000/colleges?district=${district}`
        );
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

  // // Fetch departments when the college changes
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch(
          `http://localhost:5000/departments?college=${college}`
        );
        const data = await response.json();
        // console.log(data);
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, [college]);

  //fetching job_titles
  useEffect(() => {
    async function fetchJobTitles() {
      try {
        const response = await fetch("http://localhost:5000/job-title");
        const data = await response.json();
        //console.log(data)
        setJobTitles(data);
      } catch (err) {
        console.error(err.message);
      }
    }
    fetchJobTitles();
  }, []);

  // finaly query have to be edited
  useEffect(() => {
    // Function to fetch jobs based on filters
    async function fetchJobs() {
      try {
        // Create query string based on filters
        const queryParams = new URLSearchParams({
          district: district || "",
          collegeName: college || "",
          departmentName: department || "",
          jobTitle: jobrole || "",
        }).toString();

        // Make the GET request with query parameters
        const response = await fetch(
          `http://localhost:5000/jobs-count?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setJobs(data); // Update state with fetched jobs
        console.log(data); // Log the fetched data to check the response
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
      }
    }

    // Call fetchJobs only when a filter is set
    if (district || college || department || jobrole) {
      fetchJobs();
    }
  }, [district, college, department, jobrole]);
  // Trigger when any filter changes

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
      <div className="container-fluid p-0">
        {/* Navigation Bar */}
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                   <Link to={"/home"} className="btn btn-primary">
                  Home
                </Link>
                </li>
                <li className="nav-item">
                 
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    <i className="fas fa-user"></i> Switch User
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-white"
                    href="#"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Dropdown example */}
        <Container className="mt-4">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div className="mt-1" style={{ display: "flex", gap: "1rem" }}>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  District
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {districts.map((d, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setDistrict(d.district)}
                    >
                      {d.district}{" "}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic-2">
                  College
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {colleges.map((c, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setCollege(c.college_name)}
                    >
                      {c.college_name}{" "}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic-3">
                  Department
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {departments.map((d, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setDepartment(d.department_name)}
                    >
                      {d.department_name}{" "}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic-4">
                  Jobrole
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {jobTitles.map((j, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => setJobrole(j.job_title)}
                    >
                      {j.job_title}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {/** conditionally reder the button */}
            <div className="mb-3" style={{ display: "flex", gap: "1rem" }}>
              {district && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setDistrict("")}
                  aria-label="Close"
                >
                  {district} <span aria-hidden="true">&times;</span>
                </button>
              )}
              {college && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setCollege("")}
                  aria-label="Close"
                >
                  {college} <span aria-hidden="true">&times;</span>
                </button>
              )}
              {department && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setDepartment("")}
                  aria-label="Close"
                >
                  {department} <span aria-hidden="true">&times;</span>
                </button>
              )}
              {jobrole && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setJobrole("")}
                  aria-label="Close"
                >
                  {jobrole} <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>

            {/* Table example */}
            <div className="card" style={{backgroundColor: "#f8f9fa" }}>
            <div className="card-body">
            <h3 className="card-title mb-4 text-center">Job Information</h3>
            
              <table 
              variant
              className="table table-hover table-bordered table-striped">
                <thead>
                  <tr>
                    <th>College</th>
                    <th>Department</th>
                    <th>Jobrole</th>
                    <th>Count</th>
                
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={index} >
                      <td>{job.college_name}</td>
                      <td>{job.department_name}</td>
                      <td>{job.job_title}</td>
                      <td>{job.job_count}</td>
                      
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            </div>
          
        </Container>
      </div>
    </Fragment>
  );
};

export default ShowJob;

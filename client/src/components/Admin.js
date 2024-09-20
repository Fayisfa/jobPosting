import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import AddCollegeForm from "../pages/AddCollegeForm";
import AddDepartmentForm from "../pages/AddDepartmentForm";
import AddUserForm from "../pages/AddUserForm";
import UserInformationTable from "../adminPage/UserInformationTable"; // Import the new component
import CollegeInformationTable from "../adminPage/CollegeInformationTable";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate(); // Ensure you use this if needed

  const fetchColleges = async () => {
    try {
      const response = await axios.get("http://localhost:5000/colleges-admin");
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      console.log(response); // Debugging log
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
    fetchColleges();
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  const handleCollegeUpdate = async () => {
    await fetchColleges();
  }
  const handleUserUpdate = async () => {
    await fetchUsers(); // Refresh the user list
  };
  const handleCollegeFormSuccess = async () => {
    console.log("collge added success fully");
    setSelectedOption("");
    await fetchColleges(); // Re-fetch colleges after successful addition
  };
  const handleUserFormSuccess = async () => {
    console.log("User added successfully. Refreshing user list...");
    setSelectedOption("");
    await fetchUsers(); // Re-fetch users to update the table
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?")

    if(!confirmed){
      return
    }
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      console.log("Deleting college with ID:", id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err.message);
    }
  };

const deleteCollege = async (id) => {
  // Ask for confirmation before proceeding with deletion
  const confirmed = window.confirm("Are you sure you want to delete this college?");
  
  if (!confirmed) {
    return; // Exit if the user cancels
  }
  
  console.log("Deleting college with ID:", id);
  try {
    await axios.delete(`http://localhost:5000/colleges/${id}`);
    setColleges(colleges.filter((college) => college.college_id !== id));
  } catch (err) {
    console.error("Error deleting college:", err.message);
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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link text-white active"
                  aria-current="page"
                  href="#"
                >
                  Home
                </a>
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

      {/* User Information and Admin Panel Cards */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Admin Panel</h2>
                <div
                  className="btn-group d-flex justify-content-center mb-4"
                  role="group"
                >
                  <button
                    className={`btn ${
                      selectedOption === "college"
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleOptionChange("college")}
                  >
                    Add New College
                  </button>
                  <button
                    className={`btn ${
                      selectedOption === "department"
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleOptionChange("department")}
                  >
                    Add New Department
                  </button>
                  <button
                    className={`btn ${
                      selectedOption === "user"
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleOptionChange("user")}
                  >
                    Add New User
                  </button>
                </div>

                {/* Render the corresponding form based on selected option */}
                {selectedOption === "college" && (
                  <AddCollegeForm onSuccess={handleCollegeFormSuccess} />
                )}
                {selectedOption === "department" && <AddDepartmentForm />}
                {selectedOption === "user" && (
                  <AddUserForm onSuccess={handleUserFormSuccess} />
                )}
              </div>
            </div>
          </div>

          {/* User Information Card */}
          <div className="col-md-10 mb-4">
            <UserInformationTable
              users={users}
              onDelete={deleteUser}
              onUpdate={handleUserUpdate}
            />{" "}
            {/* Use the new component */}
          </div>
          {/* College Information Card */}
          <div className="col-md-10 mb-4">
            <CollegeInformationTable colleges={colleges}
            onDelete={deleteCollege}
            onUpdate={handleCollegeUpdate} />{" "}
            {/* Pass colleges as prop */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;

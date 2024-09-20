import React, { Fragment, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import "react-toastify/dist/ReactToastify.css";

const AddUserForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);  // New flag to track success

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data.Status === "User Registered") {
        // Clear the input fields
        setName("");
        setEmail("");
        setPassword("");
        
        setError(""); 
        setIsSuccess(true);  // Set success flag
        setShowModal(true);  // Show modal on success

        // Call the onSuccess callback to refresh the user table
        if (onSuccess) onSuccess();
      } else {
         setName("");
        setEmail("");
        setPassword("");
        setError(response.data.Error || "Error during registration.");
        setIsSuccess(false);  // Clear success flag on error
        setShowModal(true);   // Show modal on error
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed.");
       setName("");
        setEmail("");
        setPassword("");
      setIsSuccess(false);  // Clear success flag on error
      setShowModal(true);   // Show modal on error
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <h3>Add New User</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Add User
        </button>
      </form>

      
      

      {/* Modal for success or error messages */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isSuccess ? "Success" : "Error"}
                </h5>
                
              </div>
              <div className="modal-body">
                <p>
                  {isSuccess
                    ? "User registered successfully!"
                    : error}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AddUserForm;

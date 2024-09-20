import React, { useState, Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included
import keralaGovtLogo from "../images/kerala_govt_logo.png";

function Register() {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  // Handle form submission
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
        setSuccess("User registered successfully!");
        setError("");
        navigate("/");
      } else {
        setError(response.data.Error);
        setSuccess("");
        setShowModal(true); // Show modal on error
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed");
      setSuccess("");
      setShowModal(true); // Show modal on error
    }
  };

  // Function to close modal
  const handleCloseModal = () => setShowModal(false);

  return (
    <Fragment>
      <div className="container-fluid p-0">
        <div className="row justify-content-center mt-4">
          <div className="col-md-4">
            <div
              className="card shadow-lg p-4 mt-5"
              style={{ borderRadius: "10px", width: "500px" }}
            >
              <div className="text-center">
                {/* Kerala government logo - use an <img> tag for the logo */}
                <img
                  src={keralaGovtLogo}
                  alt="Kerala Government Logo"
                  className="img-fluid mb-3"
                  style={{ maxWidth: "100px" }}
                />

                <h4 className="text-primary mb-4">GOVERNMENT OF KERALA</h4>
                <h6 className="text-secondary mt-4">
                  DIRECTORATE OF TECHNICAL EDUCATION
                </h6>
                <h6 className="text-muted" style={{ fontSize: ".90rem" }}>
                  ADMIN REGISTRATION
                </h6>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username "
                    style={{ textAlign: "center" }}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3 mt-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email "
                    style={{ textAlign: "center" }}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    style={{ textAlign: "center" }}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-block">
                    REGISTER
                  </button>
                </div>
              </form>
            </div>

            {/* Registration section */}

            {/* Modal for error messages */}
            {showModal && (
              <div
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
              >
                <div className="modal-dialog modal-sm" role="document">
                  {" "}
                  {/* Adjusted size */}
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Error</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={handleCloseModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>{error}</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Register;

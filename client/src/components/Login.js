import React, { useState, Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import keralaGovtLogo from '../images/kerala_govt_logo.png';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.Status === "Success") {
        if (response.data.Role === "admin") {
          navigate("/admin");
        } else {
          navigate("/addjob");
        }
      } else {
        setError(response.data.Error);
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
      setShowModal(true);
    }
  };

  return (
    <Fragment>
    
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4 mt-5" style={{ borderRadius: "10px",width: "500px" }}>
              <div className="text-center">
                {/* Kerala government logo - use an <img> tag for the logo */}
                <img src={keralaGovtLogo} 
                alt="Kerala Government Logo" 
                className="img-fluid mb-3"
                style={{maxWidth: "100px"}}/>
                
                <h4 className="text-primary mb-4">
                  GOVERNMENT OF KERALA
                </h4>
                <h6 className="text-secondary mt-4">
                  DIRECTORATE OF TECHNICAL EDUCATION
                </h6>
                <h6 className="text-muted" style={{fontSize:".90rem"}}>
                  EMPLOYEE LOGIN
                </h6>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3 mt-3">
        
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Username "
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
                    LOGIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
   

      {/* Modal for error handling */}
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">{error}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;

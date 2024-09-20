import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Form, Table } from "react-bootstrap";
import dteImage from '..//images/dteimage.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Redirect the user to the login page
      navigate("/"); // Adjust the route if needed
    } catch (error) {
      console.error("Error navigating to login:", error);
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-primary" style={{ background: "#2F71C4" }}>
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
                <Link to={"/showjob"} className="btn btn-primary">
                  Show Jobs
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="#" onClick={handleLogin}>
                  <i className="fas fa-sign-in-alt"></i> Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      

      
  {/* Visual Representations */}
 {/*
  <Row>
  
  <Col md={12} className="mb-4">
    <Card style={{ border: 'none' }}> 
      <Card.Body style={{ padding: 0 }}> 
        
        <img
          src={dteImage} 
          alt="Description of the Image"
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover',
            margin: 0, 
          }}
        />
      </Card.Body>
    </Card>
  </Col>
</Row>

*/}




  



    </div>
    
  );
};

export default Home;

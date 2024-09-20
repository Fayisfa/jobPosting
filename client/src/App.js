import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobForm from "./components/JobForm";
import ShowJob from "./pages/ShowJob";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from "./components/Home";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home/>} /> 
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/showjob"
            element={<ProtectedRoute component={ShowJob} roles={["user", "admin"]} />}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute component={Admin} roles={["admin"]} />}
          />
          <Route
            path="/addjob"
            element={
              <ProtectedRoute component={JobForm} roles={["user", "admin"]} />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

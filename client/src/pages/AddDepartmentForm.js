import React, { useState, useEffect } from "react";
import axios from "axios";

const AddDepartmentForm = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:5000/colleges-admin");
        setColleges(response.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/adddepartment", {
        department_name: departmentName,
        college_name: collegeName,
      });

      const data = await response.data;

      if (response.ok) {
        setSuccess(data.message);
        setError(null);
        setDepartmentName("");
setCollegeName("");
      } else {
        setError(data.message);
        setSuccess(null);
        setDepartmentName("");
setCollegeName("");
      }
    } catch (error) {
      setError('Internal server error');
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Department</h3>
      <div className="form-group">
        

        <label>Department Name</label>
        <select
          className="form-control"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
        >
          <option value="">Select a Department</option>
          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Instrumentation and Control Engineering">Instrumentation and Control Engineering</option>
          <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
          <option value="Information Technology">Information Technology</option>
        </select>
      </div>
      <div className="form-group">
        <label>College Name</label>
        <select
          className="form-control"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
        >
          <option value="">Select a College</option>
          {colleges.map((college) => (
            <option key={college.college_id} value={college.college_name}>
              {college.college_name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-success mt-3">
        Add Department
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
};

export default AddDepartmentForm;
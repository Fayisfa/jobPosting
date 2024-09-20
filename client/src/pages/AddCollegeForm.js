import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCollegeForm = ({ onSuccess }) => {
  const [collegeName, setCollegeName] = useState("");
  const [state, setState] = useState("Kerala");
  const [district, setDistrict] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");

  const [districts, setDistricts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/addcollege", {
        college_name: collegeName,
        state,
        district,
        established_year: establishedYear,
      });
      alert("College added successfully");

      // Trigger the success callback to refresh the table
      if (onSuccess) onSuccess();

      // Optionally, clear the form
      setCollegeName("");
      setState("");
      setDistrict("");
      setEstablishedYear("");
    } catch (error) {
      console.error(error);
    }
  };
    useEffect(() => {
   async function fetchDistricts() {
       try {
           const response = await fetch(`http://localhost:5000/districts?state=${state}`, {
               method: 'GET',
           });
           const data = await response.json();
           console.log(response);
           setDistricts(data);

           // Set first district by default only if districts exist
           if (data.length > 0) {
               setDistrict(data[0].district);
           } else {
               setDistrict(""); // Clear the district selection if no data
           }
       } catch (error) {
           console.error("Error fetching districts:", error);
       }
   }

   if (state) {  // Fetch districts only if state is selected
       fetchDistricts();
   } else {
       setDistricts([]); // Clear the districts if no state is selected
       setDistrict("");
   }
}, [state]);


  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New College</h3>
      <div className="form-group">
        <label>College Name</label>
        <input
          type="text"
          className="form-control"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
                                        <label htmlFor="state" className="form-label">State</label>
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
      <div className="form-group">
  <label>Established Year</label>
  <select
    className="form-control"
    value={establishedYear}
    onChange={(e) => setEstablishedYear(e.target.value)}
    required
  >
    <option value="">Select a Year</option>
    {Array.from({ length: 100 }, (_, index) => {
      const year = new Date().getFullYear() - index; // Adjust as needed
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    })}
  </select>
</div>

      <button type="submit" className="btn btn-success mt-3">
        Add College
      </button>
    </form>
  );
};

export default AddCollegeForm;

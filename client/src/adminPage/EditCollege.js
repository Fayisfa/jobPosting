import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

const EditCollege = ({ college, onClose, onUpdate }) => {
  // Initialize state for college details
  const [collegeName, setCollegeName] = useState(college.college_name);
  const [state, setState] = useState(college.state);
  const [district, setDistrict] = useState(college.district);
  const [establishedYear, setEstablishedYear] = useState(college.established_year);

  useEffect(() => {
    setCollegeName(college.college_name);
    setState(college.state);
    setDistrict(college.district);
    setEstablishedYear(college.established_year);
  }, [college]);

  const updateCollege = async (e) => {
    e.preventDefault();
    try {
      const body = { 
        college_name: collegeName, 
        state, 
        district, 
        established_year: establishedYear 
      };
      await axios.put(`http://localhost:5000/colleges/${college.college_id}`, body);
      
      if (typeof onUpdate === 'function') {
        onUpdate(); // Refresh the college list in the parent component
      } else {
        console.error("onUpdate is not a function");
      }
      
      if (typeof onClose === 'function') {
        onClose(); // Close the modal
      }
    } catch (err) {
      console.error("Error updating college:", err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#editCollegeModal${college.college_id}`}
      >
        Edit
      </button>

      <div
        className="modal fade"
        id={`editCollegeModal${college.college_id}`}
        tabIndex="-1"
        aria-labelledby="editCollegeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCollegeModalLabel">
                Edit College
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={updateCollege}>
                <div className="mb-3">
                  <label htmlFor="collegeName" className="form-label">
                    College Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="collegeName"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="district" className="form-label">
                    District
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="establishedYear" className="form-label">
                    Established Year
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="establishedYear"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCollege;

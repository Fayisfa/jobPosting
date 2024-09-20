// EditUser.js
import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

const EditUser = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, role };
      await axios.put(`http://localhost:5000/users/${user.id}`, body);
      if (typeof onUpdate === 'function') {
        onUpdate(); // Refresh the user list in the parent component
      } else {
        console.error("onUpdate is not a function");
      }
      if (typeof onClose === 'function') {
        onClose(); // Close the modal
      }
    } catch (err) {
      console.error("Error updating user:", err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#editUserModal${user.id}`}
      >
        Edit
      </button>

      <div
        className="modal fade"
        id={`editUserModal${user.id}`}
        tabIndex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">
                Edit User
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
              <form onSubmit={updateUser}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                <label htmlFor="role" className="form-label">
                    Role
                  </label>
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
                <button type="submit" className="btn btn-warning"
                onClick={onClose}
                data-bs-dismiss="modal"
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

export default EditUser;

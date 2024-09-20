// UserInformationTable.js
import React from "react";
import EditUser from "./EditUser";

const UserInformationTable = ({ users, onDelete, onUpdate }) => {
    return (
        <div className="card" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="card-body">
                <h3 className="card-title mb-4 text-center">User Information</h3>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><EditUser user={user} onUpdate={onUpdate} /></td>
                                <td><button className="btn btn-danger btn-sm" onClick={() => onDelete(user.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserInformationTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import EditCollege from "./EditCollege";

// Component to display the table of colleges
const CollegeInformationTable = ({colleges, onDelete, onUpdate}) => {
    // const [colleges, setColleges] = useState([]);

    // useEffect(() => {
    //     // Fetch college data from the backend
    //     axios.get("http://localhost:5000/colleges-admin") // Replace with your actual endpoint
    //         .then(response => {
    //             setColleges(response.data);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the college data!", error);
    //         });
    // }, []);

    return (
        <div className="card" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="card-body">
                <h3 className="card-title mb-4 text-center">College Informations</h3>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>College Name</th>
                            <th>State</th>
                            <th>District</th>
                            <th>Established Year</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colleges.map((college, index) => (
                            <tr key={college.college_id}>
                                <td>{index + 1}</td>
                                <td>{college.college_name}</td>
                                <td>{college.state}</td>
                                <td>{college.district}</td>
                                <td>{college.established_year}</td>
                                <td><EditCollege college={college} onUpdate={onUpdate}/></td>
                                <td><button className="btn btn-danger btn-sm" onClick={() => onDelete(college.college_id)}>Delete</button></td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CollegeInformationTable;

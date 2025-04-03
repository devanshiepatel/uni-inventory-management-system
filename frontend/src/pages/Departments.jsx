import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Rooms from './Rooms';
import './Departments.css';

const Departments = () => {
    const { faculty_id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

    useEffect(() => {
        const fetchAllDepartments = async () => {
            try {
                console.log("Fetching departments for faculty:", faculty_id); // Debugging
                const res = await axios.get(`http://localhost:8800/api/departments/${faculty_id}`);
                console.log("Departments fetched:", res.data); // Debugging
                setDepartments(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
                setDepartments([]);
            }
        };
        fetchAllDepartments();
    }, [faculty_id]);

    return (
        <div className="departments-container">
            <h2>Departments</h2>
            <div className="departments-nav">
                {departments.map((dept) => (
                    <div
                        key={dept.dept_id}
                        className={`department-tab ${selectedDepartmentId === dept.dept_id ? 'active' : ''}`}
                        onClick={() => {
                            console.log("Selected department:", dept.dept_id); // Debugging
                            setSelectedDepartmentId(dept.dept_id);
                        }}
                    >
                        {dept.dept_name}
                    </div>
                ))}
            </div>

            {/* Room Details */}
            <div className="department-content">
                {selectedDepartmentId ? (
                    <Rooms departmentId={selectedDepartmentId} />
                ) : (
                    <p>Select a department to view room details.</p>
                )}
            </div>
        </div>
    );
};

export default Departments;

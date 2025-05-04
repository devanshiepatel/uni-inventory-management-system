import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Departments.css"; // Your stylish CSS

const DepartmentsForSuperAdmin = () => {
    const [departments, setDepartments] = useState([]);
    const [expandedDept, setExpandedDept] = useState(null);
    const [roomCounts, setRoomCounts] = useState({});

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8800/api/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(res.data);
        } catch (err) {
            console.error("❌ Error fetching departments:", err);
        }
    };

    const fetchRoomCounts = async (deptId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8800/api/rooms/count-by-type/${deptId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoomCounts(prev => ({ ...prev, [deptId]: res.data }));
        } catch (err) {
            console.error(`❌ Error fetching room counts for ${deptId}:`, err);
        }
    };

    const handleDepartmentClick = (deptId) => {
        if (expandedDept === deptId) {
            setExpandedDept(null); // Collapse if already open
        } else {
            setExpandedDept(deptId);
            if (!roomCounts[deptId]) {
                fetchRoomCounts(deptId);
            }
        }
    };

    return (
        <div className="departments-container">
            <h2>Departments Overview</h2>
            <div className="departments-nav">
                {departments.map((dept) => (
                    <div key={dept.dept_id} className="department-card" onClick={() => handleDepartmentClick(dept.dept_id)}>
                        <h3>{dept.dept_name}</h3>

                        {expandedDept === dept.dept_id && (
                            <div style={{ marginTop: "10px" }}>
                                {roomCounts[dept.dept_id] ? (
                                    Object.keys(roomCounts[dept.dept_id]).map((type) => (
                                        <p key={type}>
                                            <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {roomCounts[dept.dept_id][type]}
                                        </p>
                                    ))
                                ) : (
                                    <p>Loading room details...</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentsForSuperAdmin;

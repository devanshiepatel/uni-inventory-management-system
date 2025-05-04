import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import RoomCards from './RoomCards';
import { FaUserCircle } from 'react-icons/fa';
import './Departments.css';

const Departments = () => {
    const { faculty_id } = useParams();
    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Admin";

    useEffect(() => {
        const fetchAllDepartments = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/api/departments/${faculty_id}`);
                setDepartments(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
                setDepartments([]);
            }
        };
        fetchAllDepartments();
    }, [faculty_id]);

    return (
        <>
            <style>{`
                .super-admin-dashboard {
                    display: grid;
                    grid-template-columns: 240px 1fr;
                    grid-template-rows: auto 1fr;
                    width: 100vw;
                    height: 100vh;
                    margin: 0;
                    padding: 0;
                    background-color: #F3F4F6;
                    color: #1E293B;
                }
                .top-header {
  grid-column: 2 / -1;
  grid-row: 1;
  background-color: #ffffff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #CBD5E0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.back-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-sizing: border-box;
    height: 30px; 
  transform: translateZ(0);
  margin-top: -10px; 
}

.back-button:hover {
  background-color:rgb(197, 216, 236);
  /* Subtle brightness change */
  filter: brightness(110%); /* Increase brightness on hover */
}

.back-button:active {
 
  filter: brightness(90%);
}
                .university-name {
                    margin: 0;
                    font-size: 1.5rem;
                }
                .sidebar {
                    grid-column: 1;
                    grid-row: 1 / -1;
                    background-color: #1F2937;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border-right: 1px solid #374151;
                    color: #E5E7EB;
                }
                .user-icon {
                    margin-bottom: 10px;
                }
                .user-name {
                    margin-bottom: 20px;
                    font-size: 1.1rem;
                }
                .menu-options {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }
                .menu-button {
                    background-color: #2D3748;
                    color: white;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    margin: 6px 0;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                .menu-button:hover {
                    background-color: #4A5568;
                }
                .main-content {
                    grid-column: 2 / -1;
                    grid-row: 2 / -1;
                    padding: 20px;
                    overflow-y: auto;
                    background-color: #ffffff;
                }
            `}</style>

            <div className="super-admin-dashboard">
                {/* Header */}
                <div className="top-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h1 className="university-name">Dharmshinh Desai University</h1>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    <FaUserCircle size={50} className="user-icon" />
                    <p className="user-name">{userName}</p>
                    <div className="menu-options">
                        <button className="menu-button" onClick={() => navigate("/superadmin")}>
                            Dashboard
                        </button>
                        <button className="menu-button" onClick={() => navigate("/settings")}>
                            ⚙️ Settings
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="main-content">
                    <div className="departments-container">
                        <h2>Departments</h2>
                        <div className="departments-nav">
                            {departments.map((dept) => (
                                <div
                                    key={dept.dept_id}
                                    className={`department-tab ${selectedDepartmentId === dept.dept_id ? 'active' : ''}`}
                                    onClick={() => setSelectedDepartmentId(dept.dept_id)}
                                >
                                    {dept.dept_name}
                                </div>
                            ))}
                        </div>

                        <div className="department-content">
                            {selectedDepartmentId ? (
                                <RoomCards departmentId={selectedDepartmentId} />
                            ) : (
                                <p>Select a department to view room details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Departments;

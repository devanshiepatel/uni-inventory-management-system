import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Rooms = () => {
    const { roomType } = useParams(); // Get the selected category (classroom, lab, utility)
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const { userRole, deptId } = useContext(AuthContext); // Get department ID from AuthContext
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

    useEffect(() => {
        if (!deptId) return;
    
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8800/api/rooms/${deptId}/${roomType}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(response.data);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
            }
        };
    
        fetchRooms();
    }, [deptId, roomType]); // Re-fetch when deptId or roomType changes

    return (
        <>
            {/* Embedded CSS styling */}
            <style>{`
                /* Global Styles */
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  background-color: #e9ecef;
                }
                
                /* Rooms Container: Fullscreen grid layout */
                .rooms-container {
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
                
                /* Top Header styling */
                .top-header {
                  grid-column: 2 / -1;
                  grid-row: 1;
                  background-color: #ffffff;
                  padding: 16px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid #CBD5E0;
                  position: sticky;
                  top: 0;
                  z-index: 1000;
                   width:100%;
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
                }
                .back-button:hover {
                  background-color: #0056b3;
                }
                
                .university-name {
                  margin: 0;
                  font-size: 1.5rem;
                }
                
                /* Sidebar styling */
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
                
                /* Main Content styling */
                .main-content {
                  grid-column: 2 / -1;
                  grid-row: 2 / -1;
                  padding: 20px;
                  width: 100%;
                  box-sizing: border-box;
                  overflow-y: auto;
                  background-color: #ffffff;
                  min-height: calc(100vh - 60px);
                }
                
                /* Rooms Table styling */
                .rooms-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                  font-size: 14px;
                }
                .rooms-table th, .rooms-table td {
                  border: 1px solid #ddd;
                  padding: 12px;
                  text-align: center;
                  color: #1E293B;
                }
                .rooms-table th {
                  background-color: #ff7300;
                  color: white;
                }
                .rooms-table tr:nth-child(even) {
                  background-color: #f9f9f9;
                }
                
                /* Responsive adjustments for smaller screens */
                @media (max-width: 768px) {
                  .rooms-container {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto;
                  }
                  
                  .sidebar {
                    grid-column: 1;
                    grid-row: 1;
                    width: 100%;
                    border-right: none;
                    border-bottom: 1px solid #374151;
                  }
                  
                  .top-header {
                    grid-column: 1;
                  }
                  
                  .main-content {
                    grid-column: 1;
                    grid-row: 2;
                    padding: 20px;
                  }
                }
            `}</style>

            <div className="rooms-container">
                {/* Top Header */}
                <div className="top-header">
                    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                    <h1 className="university-name">Dharmsinh Desai University</h1>
                </div>
            
                {/* Sidebar */}
                <div className="sidebar">
                    <FaUserCircle size={50} className="user-icon" />
                    <p className="user-name">{userName}</p>
            
                    <div className="menu-options">
                        <button className="menu-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
                        {(userRole === "hod" || userRole === "admin") && (
                            <button className="menu-button" onClick={() => navigate("/manage-users")}>Manage Users</button>
                        )}
                        {userRole === "admin" && (
                            <button className="menu-button" onClick={() => navigate("/manage-inventory")}>Manage Inventory</button>
                        )}
                        <button className="menu-button" onClick={() => navigate("/settings")}>⚙️ Settings</button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <h2>{roomType ? roomType.charAt(0).toUpperCase() + roomType.slice(1) : "Unknown Category"} List</h2>
                    <table className="rooms-table">
                        <thead>
                            <tr>
                                <th>Room No.</th>
                                <th>Room ID</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms?.length > 0 ? (
                                rooms.map((room) => (
                                    <tr key={room.room_id}>
                                        <td>{room.room_num}</td>
                                        <td>{room.room_id}</td>
                                        <td>{room.capacity}</td>
                                        <td>
                                            <button onClick={() => navigate(`/inventory/${room.room_id}`)}>
                                                View Inventory
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No rooms available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Rooms;

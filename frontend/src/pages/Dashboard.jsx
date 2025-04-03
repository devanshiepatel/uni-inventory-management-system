import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../auth/AuthContext";
import Notifications from "./Notifications";

const Dashboard = ({ userEmail }) => {
    const [rooms, setRooms] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    const { userRole, deptId } = useContext(AuthContext); 
    const [userName, setUserName] = useState(localStorage.getItem("userName") || ""); 

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8800/api/rooms/${deptId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(response.data);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
            }
        };
        const fetchNotifications = async () => {
          try {
              const token = localStorage.getItem("token");
              const response = await axios.get(`http://localhost:8800/api/notifications/${userEmail}`, {
                  headers: { Authorization: `Bearer ${token}` },
              });

              if (response.data.length > 0) {
                  setNotifications(response.data);
                  setShowNotification(true); // Show notification popup
                  setTimeout(() => setShowNotification(false), 5000); // Hide after 5 seconds
              }
          } catch (error) {
              console.error("❌ Error fetching notifications:", error);
          }
      };
      if (deptId) fetchRooms(); 
      if (userEmail) fetchNotifications();

      
    }, [deptId,userEmail]);

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
                
                /* Dashboard Container - Fullscreen grid layout */
                .dashboard-container {
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
                  font-size: 2.5rem;
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
                  width: 100%; /* Fixed syntax error: width=100% => width: 100%; */
                  box-sizing: border-box;
                  overflow-y: auto;
                  background-color: #ffffff;
                  min-height: calc(100vh - 60px);
                }
                
                /* Rooms Grid styling */
                /* Changed from flex to grid to expand content properly */
                .rooms-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                  gap: 20px;
                  margin-top: 20px;
                }
                
                /* Room Card styling */
                .room-card {
                  background-color: #F3F4F6;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                  cursor: pointer;
                  transition: box-shadow 0.3s;
                }
                .room-card:hover {
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }
                
                /* Responsive adjustments for smaller screens */
                @media (max-width: 768px) {
                  .dashboard-container {
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
                  .notification-popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #ffcc00;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                    display: ${showNotification ? "block" : "none"};
                    font-size: 16px;
                    font-weight: bold;}
                  .main-content {
                    grid-column: 1;
                    grid-row: 2;
                    padding: 20px;
                  }
                }
            `}</style>

            <div className="dashboard-container">
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
                        <Notifications userEmail={userEmail} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <h2>Rooms in Your Department</h2>
                    <div className="rooms-grid">
                        {["classroom", "lab", "utility"].map((category) => (
                            <div 
                                key={category} 
                                className="room-card" 
                                onClick={() => navigate(`/rooms/${category}`)}
                            >
                                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                                <p>{rooms.filter(room => room.room_type === category).length} rooms available</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {showNotification && (
                    <div className="notification-popup">
                        New Notification: {notifications[0]?.message || "You have a new update!"}
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;

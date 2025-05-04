import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import "./Settings.css";
import { useParams ,useNavigate} from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";



const Settings = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [activeView, setActiveView] = useState("dashboard");  
        const { deptId, userRole, userId } = useContext(AuthContext);
    
        const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

    // 🔹 Change Password Function
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put("http://localhost:8800/api/users/change-password", {
                user_id: user.user_id,
                currentPassword,
                newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(response.data.message);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("❌ Error changing password:", error);
            alert("Failed to change password.");
        }
    };

    // 🔹 Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/");
    };

    return (
        <div className="settings-container">
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
                                                                    
                                                                    {(userRole === "super_admin" ) && (
                                                                        <button className="menu-button" onClick={() => navigate("/superadmin")}>Dashboard</button>
                                                                     )}
                                                                    {(userRole === "hod" || userRole === "admin") && (

                                                                        <button className="menu-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
                                                                    )}
                                                                    {(userRole === "hod" || userRole === "admin") && (
                                                                        <button className="menu-button" onClick={() => navigate("/manage-users")}>Manage Users</button>
                                                                    )}
                                                                    {userRole === "admin" && (
                                                                        <button className="menu-button" onClick={() => navigate("/manage-inventory")}>Manage Inventory</button>
                                                                    )}
                                                                    <button className="menu-button" onClick={() => navigate("/settings")}>⚙️ Settings</button>
                                                                </div>
                                                            </div>
                        
                                <div className="main-content">
            <h2>⚙️ Settings</h2>

            {/* 🔹 Change Password Form */}
            <form onSubmit={handleChangePassword}>
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">🔒 Change Password</button>
            </form>

            {/* 🔹 Logout Button */}
            <button onClick={handleLogout} className="logout-button">
                🚪 Logout
            </button>
        </div>
        </div>
    );
};

export default Settings;

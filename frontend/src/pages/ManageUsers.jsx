import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [researchArea, setResearchArea] = useState(""); // For professors
    const [password, setPassword] = useState(""); // New password field
    const { deptId, userRole, userId } = useContext(AuthContext);
    const navigate = useNavigate();  
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8800/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Exclude the logged-in user from the list
            const filteredUsers = res.data.filter(user => user.user_id !== userId);
            setUsers(filteredUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
            alert("Failed to fetch users.");
        }
    };

    // Handle Adding a New User
    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized: Please log in again.");
                return;
            }

            if (!deptId) {
                alert("Department information missing. Please re-login.");
                return;
            }

            const response = await axios.post(
                "http://localhost:8800/api/register",
                {
                    username,
                    email,
                    password,
                    role,
                    dept_id: deptId,
                    research_area: role === "professor" ? researchArea : undefined
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("User added successfully!");
            console.log(response.data);
            fetchUsers();
            resetForm();
        } catch (error) {
            console.error("Error adding user:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to add user.");
        }
    };

    // Handle Updating a User
    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8800/api/update/${selectedUser}`,
                { username, email, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("User updated successfully!");
            fetchUsers();
            resetForm();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user.");
        }
    };

    // Handle Deleting a User
    const handleDeleteUser = async (user_id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8800/api/delete/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    };

    // Reset Form Fields
    const resetForm = () => {
        setUsername("");
        setEmail("");
        setRole("");
        setResearchArea("");
        setPassword("");
        setSelectedUser(null);
    };

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
                
                /* Manage Users Container - Fullscreen grid layout */
                .manage-users-container {
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
                  width: 100%; /* Ensure the main content spans full width */
                  box-sizing: border-box;
                  overflow-y: auto;
                  background-color: #ffffff;
                  min-height: calc(100vh - 60px);
                }
                
                /* User Form styling */
                .user-form {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                  margin-bottom: 20px;
                  max-width: 800px;
                }
                
                /* Input fields and labels for accessibility */
                .user-form label {
                  display: block;
                  margin-bottom: 4px;
                  font-weight: 500;
                }
                .user-form input, .user-form select {
                  width: 100%;
                  padding: 10px;
                  margin-bottom: 12px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  box-sizing: border-box;
                }
                
                /* Users Table styling */
                .users-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                  font-size: 14px;
                }
                .users-table th, .users-table td {
                  border: 1px solid #ddd;
                  padding: 12px;
                  text-align: center;
                  color: #1E293B;
                  height:20px;
                }
                .users-table th {
                  background-color: #ff7300;
                  color: white;
                }
                .users-table tr:nth-child(even) {
                  background-color: #f9f9f9;
                }
                
                /* Button styling */
                button {
                  cursor: pointer;
                  border: none;
                  border-radius: 5px;
                  padding: 10px 16px;
                  font-size: 14px;
                  transition: background-color 0.3s;
                }
                
                .edit-button {
                  background-color: #007bff;
                  color: white;
                  margin-right: 5px;
                }
                .edit-button:hover {
                  background-color: #0056b3;
                }
                
                .delete-button {
                  background-color: #dc3545;
                  color: white;
                }
                .delete-button:hover {
                  background-color: #a71d2a;
                }
                
                /* Responsive adjustments for smaller screens */
                @media (max-width: 768px) {
                  .manage-users-container {
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

            <div className="manage-users-container">
                {/* Top Header */}
                <div className="top-header">
                    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                    <h1 className="university-name">Dharmshinh Desai University</h1>
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
            
                <div className="main-content">
                    <h2>Manage Users</h2>

                    {/* Add User Form */}
                    <div className="user-form">
                        <h3>Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            {/* Added label for accessibility */}
                            <label>Username</label>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            
                            <label>Email</label>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            
                            <label>Password</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="professor">Professor</option>
                            </select>
                            {role === "professor" && (
                                <>
                                    <label>Research Area (Optional)</label>
                                    <input type="text" placeholder="Research Area (Optional)" value={researchArea} onChange={(e) => setResearchArea(e.target.value)} />
                                </>
                            )}
                            <button type="submit">Add User</button>
                        </form>
                    </div>

                    {/* Users List */}
                    <h3>Users List</h3>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.user_id}>
                                    <td>{user.user_name}</td>
                                    <td>{user.user_email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {/* Prevent editing or deleting self */}
                                        {user.user_id !== userId && (
                                            <>
                                                <button className="edit-button" onClick={() => { 
                                                    setSelectedUser(user.user_id); 
                                                    setUsername(user.user_name); 
                                                    setEmail(user.user_email); 
                                                    setRole(user.role); 
                                                }}>
                                                    Edit
                                                </button>
                                                <button className="delete-button" onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Update User Section */}
                    {selectedUser && selectedUser !== userId && (
                        <div className="user-form">
                            <h3>Update User</h3>
                            <label>Username</label>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            
                            <label>Email</label>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="admin">Admin</option>
                                <option value="professor">Professor</option>
                            </select>
                            <button onClick={handleUpdateUser}>Update User</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageUsers;

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../auth/AuthContext";

const InventoryTable = () => {
    const { roomId } = useParams();
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();  
    const { userRole, deptId } = useContext(AuthContext); 
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8800/api/inventory/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInventory(response.data);
            } catch (error) {
                console.error(" Error fetching inventory:", error);
            }
        };
        if (roomId) fetchInventory();
    }, [roomId]);

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
                
                /* Inventory Container - Fullscreen grid layout */
                .inventory-container {
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
                
                /* Search bar styling */
                .search-bar {
                  width: 100%;
                  padding: 10px;
                  margin-bottom: 20px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  box-sizing: border-box;
                }
                
                /* Inventory Table styling */
                .inventory-table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                  margin-left:-10px;
                }
                .inventory-table th, .inventory-table td {
                  border: 1px solid #ddd;
                  padding: 12px;
                  text-align: center;
                  color: #1E293B;
                }
                .inventory-table th {
                  background-color: #ff7300;
                  color: white;
                }
                .inventory-table tr:nth-child(even) {
                  background-color: #f9f9f9;
                }
                
                /* Responsive adjustments for smaller screens */
                @media (max-width: 768px) {
                  .inventory-container {
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

            <div className="inventory-container">
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
                    <h2>Inventory for Room ID: {roomId}</h2>
                    <input
                        type="text"
                        placeholder="🔍 Search items..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item ID</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Condition</th>
                                <th>Last Maintenance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory
                                .filter((item) =>
                                    item.i_name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((item) => (
                                    <tr key={item.item_id}>
                                        <td>{item.i_name}</td>
                                        <td>{item.item_id}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.status}</td>
                                        <td>{item.last_maintenance_date}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default InventoryTable;

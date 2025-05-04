import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import "./ManageInventory.css";
import { AuthContext } from "../auth/AuthContext";
import { useParams ,useNavigate} from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ManageInventory = () => {
    const { deptId, userRole } = useContext(AuthContext); // Get deptId from AuthContext
    const [inventory, setInventory] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [itemName, setItemName] = useState("");
    const [itemId, setId] = useState("");
    const [status, setStatus] = useState("");
    const [quantity, setQuantity] = useState("");
    const [room_id, setRoomId] = useState("");
    const [category, setCategory] = useState("");
    const [lastMaintenance, setLastMaintenance] = useState("");
    const navigate = useNavigate(); 
    const formRef = useRef(null);
 
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
    

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8800/api/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8800/api/inventory",
                {
                    item_id: itemId,
                    i_name: itemName,
                    category,
                    quantity,
                    room_id,
                    status,
                    last_maintenance_date: lastMaintenance,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Inventory item added successfully!");
            fetchInventory();
            resetForm();
        } catch (error) {
            console.error(" Error adding item:", error);
        }
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        if (!selectedItemId) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8800/api/inventory/${selectedItemId}`,
                {item_id: itemId, i_name: itemName, category, quantity, room_id, status, last_maintenance_date: lastMaintenance },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Inventory item updated successfully!");
            fetchInventory();
            resetForm();
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8800/api/inventory/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Inventory item deleted successfully!");
            fetchInventory();
        } catch (error) {
            console.error("❌ Error deleting item:", error);
        }
    };

    const resetForm = () => {
        setItemName("");
        setCategory("");        
        setQuantity("");
        setRoomId("");
        setStatus("");
        setLastMaintenance("");
        setSelectedItemId(null);
    };

    return (
        <div className="manage-inventory-container">
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
                <h2>Manage Inventory</h2>
    
                {/* Add / Update Inventory Form */}
                {userRole === "admin" && (
                    <div className="inventory-form" ref={formRef}>
                    <h3>{selectedItemId ? "Update Item" : "Add New Item"}</h3>
                        <form onSubmit={selectedItemId ? handleUpdateItem : handleAddItem}>
                        <input type="text" placeholder="Item Id" value={itemId} onChange={(e) => setId(e.target.value)} required disabled={selectedItemId !== null} />
                        <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                            <input type="text" placeholder="RoomId" value={room_id} onChange={(e) => setRoomId(e.target.value)} required />
                            <input type="text" placeholder="Condition" value={status} onChange={(e) => setStatus(e.target.value)} required />
                            <input type="date" placeholder="Last Maintenance Date" value={lastMaintenance} onChange={(e) => setLastMaintenance(e.target.value)} />
                            <button type="submit">{selectedItemId ? "Update Item" : "Add Item"}</button>
                        </form>
                    </div>
                )}
    
                {/* Inventory Table */}
                <h3>Inventory List</h3>
                <div className="table-wrapper">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Last Maintenance</th>
                                {userRole === "admin" && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.item_id}>
                                    <td>{item.i_name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.room_id}</td>
                                    <td>{item.status}</td>
                                    <td>{item.last_maintenance_date}</td>
                                    {userRole === "admin" && (
                                        <td>
                                            <button onClick={() => { 
                                                setSelectedItemId(item.item_id); 
                                                setItemName(item.i_name);
                                                setCategory(item.category);
                                                setQuantity(item.quantity);
                                                setRoomId(item.room_id);
                                                setStatus(item.status);
                                                setLastMaintenance(item.last_maintenance_date);
                                                setTimeout(() => {
                                                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                                                }, 100);
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteItem(item.item_id)}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    
};

export default ManageInventory;

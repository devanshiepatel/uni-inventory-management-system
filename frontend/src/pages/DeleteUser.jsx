import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateUser.css";

const DeleteUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8800/api/professors")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("❌ Error fetching users:", error);
            });
    }, []);

    const handleDelete = async (user_id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`http://localhost:8800/api/delete/${user_id}`);
            alert("✅ User deleted successfully!");
            setUsers(users.filter(user => user.user_id !== user_id));
        } catch (error) {
            console.error("❌ Error deleting user:", error);
            alert("❌ Failed to delete user.");
        }
    };

    return (
        <div>
            <h2>Delete User</h2>
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.user_name} ({user.role})
                        <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteUser;

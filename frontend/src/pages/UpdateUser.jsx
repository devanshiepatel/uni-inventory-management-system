import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UpdateUser.css";

const UpdateUser = () => {
    const { user_id } = useParams();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [deptId, setDeptId] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8800/api/user/${user_id}`)
            .then((response) => {
                const user = response.data;
                setUsername(user.user_name);
                setEmail(user.user_email);
                setRole(user.role);
                setDeptId(user.dept_id);
            })
            .catch((error) => {
                console.error("❌ Error fetching user:", error);
            });
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8800/api/update/${user_id}`, {
                username,
                email,
                role,
                dept_id: deptId
            });

            alert("✅ User updated successfully!");
        } catch (error) {
            console.error("❌ Error updating user:", error);
            alert("❌ Failed to update user.");
        }
    };

    return (
        <div>
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="admin">Admin</option>
                    <option value="teaching_staff">Teaching Staff</option>
                    <option value="professor">Professor</option>
                </select>
                <input type="text" placeholder="Department ID" value={deptId} onChange={(e) => setDeptId(e.target.value)} required />
                <button type="submit">Update User</button>
            </form>
        </div>
    );
};

export default UpdateUser;

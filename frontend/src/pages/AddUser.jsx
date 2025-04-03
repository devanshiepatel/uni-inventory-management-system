import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./AddUser.css";

const AddUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [researchArea, setResearchArea] = useState(""); // ✅ Only for professors
    const [deptId, setDeptId] = useState(""); // ✅ Auto-assigned department

    useEffect(() => {
        // ✅ Extract dept_id from the stored token
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setDeptId(decoded.dept_id); // ✅ Set department ID automatically
            } catch (err) {
                console.error("❌ Error decoding token:", err);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!deptId) {
            alert("❌ Error: Department ID not found.");
            return;
        }

        const newUser = {
            username,
            email,
            password, // ✅ Password entered by HOD/Admin
            role,
            dept_id: deptId, // ✅ Auto-assigned department
            research_area: role === "professor" ? researchArea : null // ✅ Only for professors
        };

        try {
            const response = await axios.post("http://localhost:8800/api/register", newUser);
            alert("✅ User added successfully!");
            console.log(response.data);

            // ✅ Reset form
            setUsername("");
            setEmail("");
            setRole("");
            setPassword("");
            setResearchArea("");
        } catch (error) {
            console.error("❌ Error adding user:", error);
            alert("❌ Failed to add user.");
        }
    };

    return (
        <div className="add-user-container">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />

                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required
                >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="professor">Professor</option>
                </select>

                {/* ✅ Show Research Area input only for professors */}
                {role === "professor" && (
                    <input 
                        type="text" 
                        placeholder="Research Area (Optional)" 
                        value={researchArea} 
                        onChange={(e) => setResearchArea(e.target.value)} 
                    />
                )}

                {/* ✅ Display department but do not allow editing */}
                <input 
                    type="text" 
                    placeholder="Department ID" 
                    value={deptId} 
                    readOnly 
                />

                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setUserId }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert(" Please fill in all fields");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8800/api/login", {
                email,
                password
            });

            console.log(" Login successful:", response.data);
            // alert(" Login successful!");

            const { token, user } = response.data;
            localStorage.setItem("token", token); //  Store token
            localStorage.setItem("userRole", user.role); //  Store role
            localStorage.setItem("userName", user.user_name); //  Store user name

            if (user.role === "super_admin") {
                navigate("/superadmin");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error("❌ Login failed:", error.response ? error.response.data : error);
            alert(" Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login to DDU-IMS</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Departments from "./pages/Departments";
import AddUser from "./pages/AddUser";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import ChangePassword from "./pages/ChangePassword";
import UpdateUser from "./pages/UpdateUser";
import DeleteUser from "./pages/DeleteUser";
import ManageUsers from "./pages/ManageUsers";
import ManageInventory from "./pages/ManageInventory";
import InventoryTable from "./pages/InventoryTable";
import Settings from "./pages/Settings";


function App() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(""); // ✅ Store user_id for password change

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");

            // ✅ Check if token exists and is properly formatted
            if (storedToken && storedToken.split(".").length === 3) {
                const decodedUser = jwtDecode(storedToken);
                setUser(decodedUser);
                setUserId(decodedUser.user_id); // ✅ Ensure user ID is set from token
            } else {
                console.warn("⚠️ Invalid or missing token. Logging out.");
                localStorage.removeItem("token"); // ✅ Remove bad token
                setUser(null);
                setUserId(""); // ✅ Reset userId
            }
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            localStorage.removeItem("token"); // ✅ Remove bad token
            setUser(null);
            setUserId("");
        }
    }, []);

    return (
        <AuthProvider>
        <div className="App">
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<Login setUserId={setUserId} />} /> {/* ✅ Pass setUserId */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/departments/:faculty_id" element={<Departments />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/update-user/:user_id" element={<UpdateUser />} />
                    <Route path="/delete-user" element={<DeleteUser />} />
                    <Route path="/changepassword" element={<ChangePassword user_id={userId} />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/rooms/:roomType" element={<Rooms />} />
                    <Route path="/inventory/:roomId" element={<InventoryTable />} />
                    <Route path="/manage-inventory" element={<ManageInventory />} />
                    <Route path="/settings" element={<Settings/>}/>
                </Routes>
            </header>
        </div>
        </AuthProvider>
    );
}

export default App;

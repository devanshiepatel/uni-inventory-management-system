import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");
    const [deptId, setDeptId] = useState("");  
    const [userRole, setUserRole] = useState(""); 
    const [selectedRoom, setSelectedRoom] = useState(null); // 🔹 Track selected room dynamically

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token"); 

            if (storedToken && storedToken.split(".").length === 3) {
                const decodedUser = jwtDecode(storedToken);
                console.log("🔍 Decoded Token:", decodedUser); // Debugging

                setUser(decodedUser);
                setUserId(decodedUser.user_id || "");
                setDeptId(decodedUser.dept_id || ""); 
                setUserRole(decodedUser.role || "");

                if (!decodedUser.dept_id) {
                    console.warn("⚠️ Warning: `dept_id` missing in token.");
                }
            } else {
                console.warn("⚠️ Invalid or missing token. Logging out.");
                localStorage.removeItem("token"); 
                setUser(null);
                setUserId("");
                setDeptId("");
                setUserRole("");
            }
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            localStorage.removeItem("token");
            setUser(null);
            setUserId("");
            setDeptId("");
            setUserRole("");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, setUser, 
            userId, setUserId, 
            deptId, userRole, 
            selectedRoom, setSelectedRoom // ✅ Dynamically track selected room
        }}>
            {children}
        </AuthContext.Provider>
    );
};

import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import checkMaintenanceDue from "./maintenanceNotifier.js";



dotenv.config();

const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "universitydb",
});

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));


const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Store securely in .env

app.get("/notifications/:email", (req, res) => {
    const { email } = req.params;
    db.query(
      "SELECT * FROM notifications WHERE user_email = ? AND is_read = false",
      [email],
      (err, results) => {
        if (err) {
          res.status(500).json({ message: "Error fetching notifications" });
        } else {
          res.json(results);
        }
      }
    );
  });

  app.get("/api/notifications/:userEmail", (req, res) => {
    const userEmail = req.params.userEmail;
    
    const query = "SELECT * FROM notifications WHERE user_email = ? AND is_read = false ORDER BY created_at DESC";
    
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
    });
});

  
  // Mark notification as read
  app.post("/notifications/read", (req, res) => {
    const { id } = req.body;
    db.query(
      "UPDATE notifications SET is_read = true WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          res.status(500).json({ message: "Error updating notification status" });
        } else {
          res.json({ success: true });
        }
      }
    );
  });
  
  // Start Express Server
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    checkMaintenanceDue(); // Run check on startup
  });

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.error("❌ No token provided in request headers.");
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        console.log("🔹 Verifying Token:", token);
        const verified = jwt.verify(token, SECRET_KEY);
        console.log("✅ Token Verified:", verified);
        req.user = verified;
        next();
    } catch (err) {
        console.error("❌ Invalid Token:", err.message);
        return res.status(400).json({ message: "Invalid token" });
    }
};


// API: Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    // Step 1: Ensure email is from "ddu.ac.in" domain
    if (!email.endsWith("@ddu.ac.in")) {
        return res.status(403).json({ message: "❌ Only @ddu.ac.in emails are allowed to log in." });
    }

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const q = "SELECT user_id, user_name, password_hash, role, dept_id FROM users WHERE user_email = ?";

    db.query(q, [email], async (err, data) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (data.length === 0) return res.status(401).json({ message: "User not found" });

        const user = data[0];

        // 🔒 Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        if (!user.dept_id && (user.role === "hod" || user.role === "admin")) {
            return res.status(400).json({ message: "❌ Department information missing. Please contact the admin." });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, dept_id: user.dept_id || null },
            SECRET_KEY,
            { expiresIn: "5d" }
        );
        
        console.log("Login successful! Sending token:", token);
        res.json({ message: "Login successful!", token, user });
    });
});


// API: Change Password
app.put("/api/users/change-password", verifyToken, async (req, res) => {
    try {
        const { user_id, currentPassword, newPassword } = req.body;

        if (!user_id || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Step 1: Get the current password hash from the database
        const q = "SELECT password_hash FROM users WHERE user_id = ?";
        db.query(q, [user_id], async (err, data) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (data.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const storedHashedPassword = data[0].password_hash;

            // Step 2: Compare provided current password with stored hash
            const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
            if (!isMatch) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }

            // Step 3: Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Step 4: Update password in the database
            const updateQuery = "UPDATE users SET password_hash = ?, reset_token = NULL WHERE user_id = ?";
            db.query(updateQuery, [hashedNewPassword, user_id], (err, result) => {
                if (err) {
                    console.error("❌ Error updating password:", err);
                    return res.status(500).json({ message: "Database error", error: err });
                }
                res.json({ message: "Password updated successfully!" });
            });
        });
    } catch (error) {
        console.error("❌ Error processing password change:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// API: Fetch Rooms Based on Category
app.get("/api/rooms/:dept_id/:room_type", verifyToken, (req, res) => {
    const { dept_id, room_type } = req.params;

    if (!dept_id || !room_type) {
        return res.status(400).json({ error: "Invalid department ID or room type" });
    }

    const q = "SELECT * FROM rooms WHERE dept_id = ? AND room_type = ?";

    db.query(q, [dept_id, room_type], (err, data) => {
        if (err) {
            console.error(`❌ Error fetching ${room_type} rooms:`, err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: `No ${room_type} rooms found for this department` });
        }
        console.log(`✅ ${room_type} rooms API Response:`, data);
        return res.json(data);
    });
});

app.get("/api/inventory", verifyToken, (req, res) => {
    const { dept_id } = req.user; // Get user's department from token

    if (!dept_id) {
        return res.status(403).json({ message: "❌ Unauthorized: No department assigned." });
    }

    // Step 1: Get all room IDs belonging to the department
    const roomQuery = `SELECT room_id FROM rooms WHERE dept_id = ?`;
    db.query(roomQuery, [dept_id], (err, rooms) => {
        if (err) {
            console.error("❌ Error fetching rooms:", err);
            return res.status(500).json({ error: "Database query failed (rooms)" });
        }

        if (rooms.length === 0) {
            return res.status(404).json({ message: "⚠️ No rooms found for this department." });
        }

        const roomIds = rooms.map(room => room.room_id); // Extract room IDs
        console.log("✅ Rooms in dept:", roomIds);

        // Step 2: Fetch inventory items for these rooms
        const inventoryQuery = `SELECT * FROM inventory_items WHERE room_id IN (?)`;
        db.query(inventoryQuery, [roomIds], (err, inventory) => {
            if (err) {
                console.error("❌ Error fetching inventory:", err);
                return res.status(500).json({ error: "Database query failed (inventory)" });
            }

            if (inventory.length === 0) {
                return res.status(404).json({ message: "⚠️ No inventory found for this department's rooms." });
            }

            res.json(inventory);
        });
    });
});


app.get("/api/inventory/:roomId", verifyToken, (req, res) => {
    const { roomId } = req.params;
    const { dept_id } = req.user; // Get user's department from the token

    console.log("📌 Received request for inventory of Room ID:", roomId);
    console.log("📌 User's department:", dept_id);

    if (!roomId) {
        console.error("❌ Error: Missing roomId in request.");
        return res.status(400).json({ message: "❌ Bad Request: roomId is required." });
    }

    // 🔹 Join with `rooms` table to filter by department
    const q = `
        SELECT i.*
        FROM inventory_items i
        JOIN rooms r ON i.room_id = r.room_id
        WHERE i.room_id = ? AND r.dept_id = ?
    `;

    db.query(q, [roomId, dept_id], (err, data) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "⚠️ No inventory found for this room in your department." });
        }
        res.json(data);
    });
});

//add item
app.post("/api/inventory", verifyToken, (req, res) => {
    const { item_id ,i_name, category, quantity, room_id, status, last_maintenance_date } = req.body;
    const { role } = req.user; // Get user role

    if (role !== "admin") {
        return res.status(403).json({ message: "❌ Unauthorized: Only admins can add inventory items." });
    }

    const q = "INSERT INTO inventory_items (item_id, i_name, category, quantity, room_id, status, last_maintenance_date) VALUES (?, ?, ?, ?, ?, ?,?)";
    db.query(q, [item_id, i_name, category, quantity, room_id, status, last_maintenance_date], (err, result) => {
        if (err) {
            console.error("❌ Error adding inventory item:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "✅ Inventory item added successfully!", item_id: result.insertId });
    });
});

//update item
app.put("/api/inventory/:itemId", verifyToken, (req, res) => {
    const { itemId } = req.params;
    const { i_name, category, quantity, room_id, status, last_maintenance_date } = req.body;
    const { role } = req.user;

    if (role !== "admin") {
        return res.status(403).json({ message: " Unauthorized: Only admins can update inventory items." });
    }

    const q = "UPDATE inventory_items SET i_name = ?, category = ?, quantity = ?,room_id = ?, status = ?, last_maintenance_date = ? WHERE item_id = ?";
    db.query(
        q,
        [i_name, category, quantity, room_id, status, last_maintenance_date, itemId],
        (err, result) => {
          if (err) {
            console.error(" Error updating inventory item:", err);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: " Inventory item updated successfully!" });
        }
      );
      
});


app.delete("/api/inventory/:itemId", verifyToken, (req, res) => {
    const { itemId } = req.params;
    const { role } = req.user;

    if (role !== "admin") {
        return res.status(403).json({ message: "❌ Unauthorized: Only admins can delete inventory items." });
    }

    const q = "DELETE FROM inventory_items WHERE item_id = ?";
    db.query(q, [itemId], (err, result) => {
        if (err) {
            console.error("❌ Error deleting inventory item:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "✅ Inventory item deleted successfully!" });
    });
});


// API: Register User (HOD/Admin)
 app.post("/api/register", async (req, res) => {
    const { username, email, password, role, research_area } = req.body;

     // ✅ Extract department from the logged-in user (HOD/Admin)
     const token = req.headers.authorization?.split(" ")[1];
     if (!token) return res.status(401).json({ message: "Unauthorized: No token provided." });

     let dept_id;
     try {
         const decoded = jwt.verify(token, SECRET_KEY);
         dept_id = decoded.dept_id; // ✅ Get dept_id from logged-in user
         if (!dept_id) return res.status(400).json({ message: "HOD/Admin does not have a department assigned!" });
     } catch (err) {
         return res.status(400).json({ message: "Invalid token." });
     }

     if (!username || !email || !password || !role) {
         return res.status(400).json({ message: "All fields are required except research area (optional for professors)" });
     }

    const user_id = uuidv4();
     const hashedPassword = await bcrypt.hash(password, 10);

     const q = "INSERT INTO users (user_id, user_name, user_email, password_hash, role, dept_id) VALUES (?, ?, ?, ?, ?, ?)";
     db.query(q, [user_id, username, email, hashedPassword, role, dept_id], (err, result) => {
         if (err) return res.status(500).json({ message: "Database error", error: err });

        // ✅ If role is "professor", insert research area
         if (role === "professor" && research_area) {
             const q2 = "UPDATE professors SET research_area = ? WHERE user_id = ?";
             db.query(q2, [research_area, user_id], (err, result) => {
                 if (err) return res.status(500).json({ message: "Error updating research area", error: err });
             });
         }

         res.json({ message: "User registered successfully!", user_id });
     });
 });


// API: Update User (HOD/Admin)
app.put("/api/update/:user_id", verifyToken, (req, res) => {
    const { user_id } = req.params;
    const { username, email, role } = req.body;

    const q = "UPDATE users SET user_name = ?, user_email = ?, role = ? WHERE user_id = ?";
    db.query(q, [username, email, role, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        res.json({ message: "User updated successfully!" });
    });
});

// API: Delete User (HOD/Admin)
app.delete("/api/delete/:user_id", verifyToken, (req, res) => {
    const { user_id } = req.params;

    const q = "DELETE FROM users WHERE user_id = ?";
    db.query(q, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        res.json({ message: "User deleted successfully!" });
    });
});

// API: Fetch Professors (Super Admin View)
app.get("/api/professors", verifyToken, (req, res) => {
    const q = `
        SELECT p.professor_id, u.user_id, u.user_name, u.user_email, u.role, p.dept_id, p.faculty_id
        FROM professors p
        JOIN users u ON p.user_id = u.user_id
        WHERE u.role = 'professor'
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("✅ Professors API Response:", data);
        res.json(data);
    });
});


// API: Change Password
// app.put("/api/users/change-password", verifyToken, async (req, res) => {
//     const { user_id, currentPassword, newPassword } = req.body;

//     if (!user_id || !currentPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });

//     const q = "SELECT password_hash FROM users WHERE user_id = ?";
//     db.query(q, [user_id], async (err, data) => {
//         if (err) return res.status(500).json({ message: "Database error", error: err });

//         if (data.length === 0) return res.status(404).json({ message: "User not found" });

//         const isMatch = await bcrypt.compare(currentPassword, data[0].password_hash);
//         if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         const updateQuery = "UPDATE users SET password_hash = ? WHERE user_id = ?";

//         db.query(updateQuery, [hashedNewPassword, user_id], (err, result) => {
//             if (err) return res.status(500).json({ message: "Database error", error: err });

//             res.json({ message: "Password updated successfully!" });
//         });
//     });
// });

// ✅ API: Fetch Rooms for Professors
app.get("/api/rooms/:dept_id", verifyToken, (req, res) => {
    const { dept_id } = req.params;
    if (!dept_id) return res.status(400).json({ error: "Invalid department ID" });

    const q = "SELECT * FROM rooms WHERE dept_id = ?";
    db.query(q, [dept_id], (err, data) => {
        if (err) return res.status(500).json({ error: "Database query failed" });

        res.json(data);
    });
});



// // API to Fetch Faculties
 app.get("/api/faculties", (req, res) => {
     const q = "SELECT faculty_id, f_name FROM faculties";
     db.query(q, (err, data) => {
         if (err) {
             console.error("❌ Error fetching faculties:", err);
             return res.status(500).json({ message: "Database error", error: err });
         }
         res.json(data);
     });
 });

// //  API to Fetch Departments Based on Selected Faculty
 app.get("/api/departments/:faculty_id", (req, res) => {
     const { faculty_id } = req.params;

     const q = "SELECT dept_id, dept_name FROM departments WHERE faculty_id = ?";
     db.query(q, [faculty_id], (err, data) => {
         if (err) {
             console.error("❌ Error fetching departments:", err);
             return res.status(500).json({ message: "Database error", error: err });
         }
         res.json(data);
     });
 });

//  app.get("/api/departments", verifyToken, (req, res) => {
//     const q = "SELECT dept_id, dept_name FROM departments";
//     db.query(q, (err, data) => {
//         if (err) {
//             console.error("❌ Error fetching departments:", err);
//             return res.status(500).json({ message: "Database error", error: err });
//         }
//         res.json(data);
//     });
// });

// ✅ Fetch Professors by Department
app.get("/api/professors/:deptId", verifyToken, (req, res) => {
    const { deptId } = req.params;
    const q = `SELECT user_id, user_name, user_email FROM users WHERE role = 'professor' AND dept_id = ?`;
    db.query(q, [deptId], (err, data) => {
        if (err) {
            console.error("❌ Error fetching professors:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(data);
    });
});


// ✅ Assign HOD to an Existing Department (Demote previous HOD)

app.put("/api/superadmin/assign-hod", verifyToken, (req, res) => {
    const { dept_id, user_id } = req.body;

    if (!dept_id || !user_id) {
        return res.status(400).json({ message: "❌ Missing department or user ID" });
    }

    // Step 1: Find the current HOD for this department
    db.query("SELECT user_id FROM users WHERE role = 'hod' AND dept_id = ?", [dept_id], (err, hodData) => {
        if (err) {
            console.error("❌ Error fetching HOD:", err);
            return res.status(500).json({ message: "Error fetching HOD", error: err });
        }

        if (hodData.length > 0) {
            const previousHOD = hodData[0].user_id;

            // Step 2: Change the old HOD's role to "professor"
            db.query("UPDATE users SET role = 'professor' WHERE user_id = ?", [previousHOD], (err) => {
                if (err) {
                    console.error("❌ Error updating old HOD:", err);
                    return res.status(500).json({ message: "Error updating old HOD", error: err });
                }
            });
        }

        // Step 3: Assign the new HOD
        db.query("UPDATE users SET role = 'hod' WHERE user_id = ? AND dept_id = ?", [user_id, dept_id], (err) => {
            if (err) {
                console.error("❌ Error assigning new HOD:", err);
                return res.status(500).json({ message: "Error assigning new HOD", error: err });
            }

            // Step 4: Update the department's HOD
            db.query("UPDATE departments SET hod_id = ? WHERE dept_id = ?", [user_id, dept_id], (err) => {
                if (err) {
                    console.error("❌ Error updating department:", err);
                    return res.status(500).json({ message: "Error updating department", error: err });
                }

                res.json({ message: "New HOD assigned successfully!" });
            });
        });
    });
});




// ✅ Delete HOD (Remove from database)
app.delete("/api/superadmin/delete-hod/:deptId", verifyToken, async (req, res) => {
    const { deptId } = req.params;

    try {
        const connection = await db.promise().getConnection();
        await connection.beginTransaction(); // 🔹 Start transaction

        // Step 1: Find HOD in the department
        const [hodData] = await connection.query(
            "SELECT user_id FROM users WHERE role = 'hod' AND dept_id = ?",
            [deptId]
        );

        if (hodData.length === 0) {
            return res.status(404).json({ message: "No HOD found in this department" });
        }

        const hodId = hodData[0].user_id;

        // Step 2: Remove HOD reference from departments
        await connection.query(
            "UPDATE departments SET hod_id = NULL WHERE dept_id = ?",
            [deptId]
        );

        // Step 3: Delete the HOD from users table
        await connection.query(
            "DELETE FROM users WHERE user_id = ?",
            [hodId]
        );

        await connection.commit();
        connection.release();

        res.json({ message: "✅ HOD deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting HOD:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});



// ✅ Create a New Department with a New HOD
app.post("/api/superadmin/create-department", verifyToken, (req, res) => {
    const { dept_id, dept_name, faculty_id, hod_name, hod_email, hod_password } = req.body;

    if (!dept_id || !dept_name || !faculty_id || !hod_name || !hod_email || !hod_password) {
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // Step 1: Insert new department with faculty_id
    db.query(
        "INSERT INTO departments (dept_id, dept_name, faculty_id) VALUES (?, ?, ?)",
        [dept_id, dept_name, faculty_id],
        (err) => {
            if (err) {
                console.error("❌ Error inserting department:", err);
                return res.status(500).json({ message: "Error inserting department", error: err });
            }

            // Step 2: Hash password for the new HOD
            bcrypt.hash(hod_password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("❌ Error hashing password:", err);
                    return res.status(500).json({ message: "Error hashing password", error: err });
                }

                // Step 3: Insert the new HOD in the users table
                db.query(
                    "INSERT INTO users (user_name, user_email, password_hash, role, dept_id) VALUES (?, ?, ?, 'hod', ?)",
                    [hod_name, hod_email, hashedPassword, dept_id],
                    (err, result) => {
                        if (err) {
                            console.error("❌ Error inserting HOD:", err);
                            return res.status(500).json({ message: "Error inserting HOD", error: err });
                        }

                        const newHodId =  uuidv4();

                        // Step 4: Assign the new HOD in the department
                        db.query("UPDATE departments SET hod_id = ? WHERE dept_id = ?", [newHodId, dept_id], (err) => {
                            if (err) {
                                console.error("❌ Error updating department:", err);
                                return res.status(500).json({ message: "Error updating department", error: err });
                            }

                            res.json({ message: "Department and HOD created successfully!" });
                        });
                    }
                );
            });
        }
    );
});


app.get('/api/rooms/:dept_id', (req, res) => {
     const department_id = req.params.dept_id;

     if (!department_id) {
         return res.status(400).json({ error: "Invalid department ID" });
     }

     const q = "SELECT * FROM rooms WHERE dept_id = ?";

     db.query(q, [department_id], (err, data) => {
         if (err) {
             console.error("❌ Error fetching rooms:", err);
             return res.status(500).json({ error: "Database query failed" });
         }
         if (data.length === 0) {
             return res.status(404).json({ message: "No rooms found for this department" });
         }
         console.log("Rooms API Response:", data);
         return res.json(data);
     });
 });

 app.get("/api/users", verifyToken, (req, res) => {
    const { dept_id, role } = req.user;

    // Super Admin gets all users, others see only their department
    const query = role === "super_admin"
        ? "SELECT user_id, user_name, user_email, role FROM users"
        : "SELECT user_id, user_name, user_email, role FROM users WHERE dept_id = ?";

    const queryParams = role === "super_admin" ? [] : [dept_id];

    db.query(query, queryParams, (err, data) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(data);
    });
});

// ✅ API: Register User (HOD/Admin)
app.post("/api/register", async (req, res) => {
    try {
        // 🔍 Extract and verify the token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // ✅ Extract the department from the logged-in user
        const dept_id = decoded.dept_id;
        if (!dept_id) {
            return res.status(403).json({ message: "Unauthorized: Missing department info" });
        }

        // 🔍 Extract user details from request body
        const { username, email, password, role, research_area } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required except research area (optional for professors)" });
        }

        // 🔐 Generate UUID for new user & hash password
        const user_id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Insert new user into the `users` table
        const insertUserQuery = "INSERT INTO users (user_id, user_name, user_email, password_hash, role, dept_id) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(insertUserQuery, [user_id, username, email, hashedPassword, role, dept_id], (err, result) => {
            if (err) {
                console.error("❌ Error registering user:", err);
                return res.status(500).json({ message: "Database error", error: err });
            }

            // 🔹 If role is "professor", insert research area
            if (role === "professor" && research_area) {
                const insertProfessorQuery = "INSERT INTO professors (user_id, research_area, dept_id) VALUES (?, ?, ?)";
                db.query(insertProfessorQuery, [user_id, research_area, dept_id], (err, result) => {
                    if (err) {
                        console.error("❌ Error inserting professor research area:", err);
                        return res.status(500).json({ message: "Database error while inserting professor data", error: err });
                    }
                });
            }

            console.log("✅ User registered successfully:", { user_id, username, role, dept_id });
            res.json({ message: "User registered successfully!", user_id });
        });

    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
// ✅ Start Backend Server
app.listen(8800, () => {
    console.log("✅ Backend running on port 8800!");
});

import cron from "node-cron";
import mysql from "mysql";


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "universitydb",
});

db.connect((err) => {
  if (err) console.error("Database connection error:", err);
});

async function checkMaintenanceDue() {
  try {
    db.query(
      `SELECT users.user_email, users.dept_id, inventory_items.i_name, inventory_items.last_maintenance_date 
       FROM users
       JOIN rooms ON users.dept_id = rooms.dept_id
       JOIN inventory_items ON inventory_items.room_id = rooms.room_id
       WHERE users.role = 'admin' 
       AND DATEDIFF(CURDATE(), inventory_items.last_maintenance_date) >= 30;`,
      (err, results) => {
          if (err) {
              console.error("Error fetching users and inventory:", err);
              return;
          }
  
          console.log("Query results:", results);  // Debugging: See what data is coming
  
          results.forEach((row) => {
            console.log("Processing row:", row); // Debugging
        
            if (!row.user_email) {  // Fix: Use row.user_email instead of row.email
                console.error("ERROR: Missing email for department:", row.dept_id);
                return; // Skip inserting if email is missing
            }
        
            const message = `Reminder: The item '${row.i_name}' in department '${row.dept_id}' was last maintained on ${row.last_maintenance_date} and is due for maintenance.`;
        
            db.query(
                "INSERT INTO notifications (user_email, message, is_read) VALUES (?, ?, false)",
                [row.user_email, message],  // Fix: Use row.user_email
                (err, result) => {
                    if (err) {
                        console.error("Error inserting notification:", err);
                    } else {
                        console.log("Notification inserted successfully");
                    }
                }
            );
        });
        
      }
  );
  
  } catch (error) {
    console.error("Error checking maintenance:", error);
  }
}

// Schedule cron job to run daily at 9 AM
cron.schedule("0 5 * * *", checkMaintenanceDue);

export default checkMaintenanceDue;



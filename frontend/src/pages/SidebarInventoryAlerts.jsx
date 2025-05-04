// SidebarInventoryAlerts.jsx
import { useEffect, useState } from "react";

const SidebarInventoryAlerts = () => {
  const [oldItems, setOldItems] = useState([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  
  const role = localStorage.getItem("userRole")?.trim().toLowerCase();



  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8800/api/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch inventory.");
        const data = await res.json();
        console.log(data);
        console.log("Role is:", role); // Should be "admin"


        const now = new Date();
        const filtered = data.filter(item => {
          if (!item.last_maintenance_date) return false;
          const last = new Date(item.last_maintenance_date);
          const diffDays = (now - last) / (1000 * 60 * 60 * 24);
          return diffDays > 30;
        });

        setOldItems(filtered);
      } catch (err) {
        setError("Couldn't load maintenance alerts.");
      }
    };

    fetchInventory();
  }, [refresh]);


  const handleUpdateDate = async (item) => {

    const defaultDate = new Date().toISOString().split("T")[0];
  const selectedDate = window.prompt(
    `Enter maintenance date for "${item.i_name}" (Room ${item.room_id}) in YYYY-MM-DD format:`,
    defaultDate
  );

  if (!selectedDate) return;

  // Simple validation for format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    alert("Invalid date format. Please use YYYY-MM-DD.");
    return;
  }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8800/api/inventory/${item.item_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...item,
          last_maintenance_date: selectedDate,
          status: "up to date", 
        }),
      });

      if (!res.ok) throw new Error("Failed to update item.");
      setRefresh(prev => !prev); // re-fetch updated list
      alert(" Maintenance date updated successfully.");
    } catch (err) {
      alert(" Failed to update maintenance date.");
    }
  };


  return (
    <div style={{ 
      marginTop: "30px",
      width: "100%",
      maxHeight: "300px",
      overflowY: "auto"
    }}>
      <h4 style={{ color: "#fff", marginBottom: "10px" }}>🛠️ Maintenance Alerts</h4>

      {error ? (
        <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>
      ) : oldItems.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No pending items</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    {oldItems.map(item => (
      <li 
        key={item.item_id}
        //onClick={() => handleUpdateDate(item)}
        onClick={role === "admin" ? () => handleUpdateDate(item) : undefined} 
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "8px",
          borderRadius: "5px",
          marginBottom: "6px",
          fontSize: "13px",
          cursor: role === "admin" ? "pointer" : "not-allowed",
          opacity: role === "admin" ? 1 : 0.6,
          transition: "background 0.3s"
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#ffffff")}
              title="Click to mark as maintained"
        >
        {item.i_name} (Room {item.room_id})
      </li>
    ))}
  </ul>
      )}
    </div>
  );
};

export default SidebarInventoryAlerts;

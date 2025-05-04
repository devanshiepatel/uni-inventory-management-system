// import { useEffect, useState } from "react";

// const Notifications = ({ userEmail }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:8800/notifications/${userEmail}`)
//       .then((res) => res.json())
//       .then((data) => setNotifications(data))
//       .catch((err) => console.error("Error fetching notifications:", err));
//   }, [userEmail]);

//   const markAsRead = async (id) => {
//     await fetch("http://localhost:8800/notifications/read", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     setNotifications(notifications.filter((n) => n.id !== id));
//   };

//   // return (
//   //   <div className="notifications-container">
//   //     <h3>Notifications</h3>
//   //     {notifications.length === 0 ? (
//   //       <p>No new notifications</p>
//   //     ) : (
//   //       <ul>
//   //         {notifications.map((notif) => (
//   //           <li key={notif.id}>
//   //             {notif.message}
//   //             <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     )}
//   //   </div>
//   // );
//   return (
//     <div className="notifications-container" style={{ marginTop: "20px", width: "100%" }}>
//       <h4 style={{ marginBottom: "10px", color: "#ffffff" }}>🔔 Notifications</h4>
//       {notifications.length === 0 ? (
//         <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No new notifications</p>
//       ) : (
//         <ul style={{ listStyleType: "none", padding: 0 }}>
//           {notifications.map((notif) => (
//             <li key={notif.id} style={{
//               backgroundColor: "#374151",
//               color: "#F9FAFB",
//               padding: "10px",
//               borderRadius: "5px",
//               marginBottom: "10px",
//               fontSize: "13px"
//             }}>
//               {notif.message}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
  
// };

// export default Notifications;


import { useEffect, useState } from "react";

const Notifications = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8800/api/notifications/${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch notifications.");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        setError("Failed to load notifications.");
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  return (
    <div className="notifications-container" style={{ marginTop: "30px", width: "100%" }}>
      <h4 style={{ color: "#fff", marginBottom: "10px" }}>🔔 Notifications</h4>

      {error ? (
        <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>
      ) : notifications.length === 0 ? (
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No new notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((notif) => (
            <li key={notif.id} style={{
              backgroundColor: "#374151",
              color: "#F9FAFB",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "8px",
              fontSize: "13px"
            }}>
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

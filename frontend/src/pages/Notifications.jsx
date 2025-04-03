import { useEffect, useState } from "react";

const Notifications = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/notifications/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [userEmail]);

  const markAsRead = async (id) => {
    await fetch("http://localhost:5000/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.message}
              <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

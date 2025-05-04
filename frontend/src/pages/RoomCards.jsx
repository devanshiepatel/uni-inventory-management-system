import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RoomCards.css';

const RoomCards = ({ departmentId }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (departmentId) {
            console.log("Fetching rooms for department:", departmentId); // Debugging
            axios.get(`http://localhost:8800/api/rooms/${departmentId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              })
                .then(response => {
                    console.log("Rooms fetched:", response.data); // Debugging
                    setRooms(response.data);
                })
                .catch(error => {
                    console.error("Error fetching rooms:", error);
                    setRooms([]);
                })
                .finally(() => setLoading(false));
        }
    }, [departmentId]);

    console.log("Rooms state:", rooms); // Debugging

    // Count rooms based on type
    const classroomCount = rooms.filter(room => room.room_type === 'classroom').length;
    const labCount = rooms.filter(room => room.room_type === 'lab').length;
    const utilityCount = rooms.filter(room => room.room_type === 'utility').length;

    console.log(`Classroom Count: ${classroomCount}, Lab Count: ${labCount}, Utility Count: ${utilityCount}`);

    return (
        <div className="rooms-container">
            <h3>Room Details</h3>

            {loading ? (
                <p>Loading rooms...</p>
            ) : (
                <div className="room-list">
                    {/* Classroom Card */}
                    <div className="room-card">
                        <h4>📚 Classrooms</h4>
                        <p>{classroomCount > 0 ? `Total: ${classroomCount}` : "No information available"}</p>
                    </div>

                    {/* Lab Card */}
                    <div className="room-card">
                        <h4>🔬 Labs</h4>
                        <p>{labCount > 0 ? `Total: ${labCount}` : "No information available"}</p>
                    </div>

                    {/* Utility Room Card */}
                    <div className="room-card">
                        <h4>🛠️ Utility Rooms</h4>
                        <p>{utilityCount > 0 ? `Total: ${utilityCount}` : "No information available"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomCards;

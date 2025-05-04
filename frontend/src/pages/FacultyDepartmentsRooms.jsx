import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Departments.css'; // already beautifully styled

const FacultyDepartmentsRooms = () => {
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8800/api/faculties", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFaculties(res.data);
        } catch (error) {
            console.error("❌ Error fetching faculties:", error);
        }
    };

    const fetchDepartments = async (facultyId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8800/api/departments/${facultyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(res.data);
        } catch (error) {
            console.error("❌ Error fetching departments:", error);
        }
    };

    const fetchRooms = async (departmentId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8800/api/rooms/by-department/${departmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(res.data);
        } catch (error) {
            console.error("❌ Error fetching rooms:", error);
        }
    };

    const handleFacultyClick = (facultyId) => {
        setSelectedFacultyId(facultyId);
        setSelectedDepartmentId(null); // Reset department
        setRooms([]); // Clear rooms
        fetchDepartments(facultyId);
    };

    const handleDepartmentClick = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        fetchRooms(departmentId);
    };

    return (
        <div className="departments-container">
            <h2>Faculties</h2>
            {/* Faculty Cards */}
            <div className="departments-nav">
                {faculties.map((faculty) => (
                    <div
                        key={faculty.faculty_id}
                        className="department-tab"
                        onClick={() => handleFacultyClick(faculty.faculty_id)}
                    >
                        {faculty.f_name}
                    </div>
                ))}
            </div>

            {/* Department Tabs */}
            {selectedFacultyId && (
                <>
                    <h3>Departments</h3>
                    <div className="departments-nav">
                        {departments.map((dept) => (
                            <div
                                key={dept.dept_id}
                                className={`department-tab ${selectedDepartmentId === dept.dept_id ? 'active' : ''}`}
                                onClick={() => handleDepartmentClick(dept.dept_id)}
                            >
                                {dept.dept_name}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Rooms View */}
            {selectedDepartmentId && (
                <>
                    <h3>Rooms</h3>
                    <div className="department-rooms">
                        {rooms.map((room) => (
                            <div key={room.room_id} className="room-card">
                                <h4>{room.room_num}</h4>
                                <p>Type: {room.room_type}</p>
                                <p>Capacity: {room.capacity}</p>
                            </div>
                        ))}
                        {rooms.length === 0 && <p>No rooms found for this department.</p>}
                    </div>
                </>
            )}
        </div>
    );
};

export default FacultyDepartmentsRooms;

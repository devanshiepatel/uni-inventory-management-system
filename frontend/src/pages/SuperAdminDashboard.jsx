
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Departments from "./Departments";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptId, setNewDeptId] = useState("");
  const [newHodName, setNewHodName] = useState("");
  const [newHodEmail, setNewHodEmail] = useState("");
  const [newHodPassword, setNewHodPassword] = useState("");
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "assignHod", "createDept"

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8800/api/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculties(res.data);
    } catch (error) {
      console.error("❌ Error fetching faculties:", error);
    }
  };

  // Fetch faculties on every render (for simplicity; ideally call this once in useEffect)
  fetchFaculties();

  const fetchProfessors = async (deptId) => {
    if (!deptId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8800/api/professors/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessors(res.data);
    } catch (error) {
      console.error("❌ Error fetching professors:", error);
    }
  };

  const handleAssignHOD = async () => {
    if (!selectedDepartment || !selectedProfessor) {
      alert("⚠️ Please select both a department and a professor.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8800/api/superadmin/assign-hod",
        {
          dept_id: selectedDepartment,
          user_id: selectedProfessor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ HOD assigned successfully!");
      setSelectedProfessor("");
      fetchProfessors(selectedDepartment);
    } catch (error) {
      console.error("❌ Error assigning HOD:", error);
      alert("❌ Failed to assign HOD.");
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName || !newDeptId || !selectedFaculty || !newHodName || !newHodEmail || !newHodPassword) {
      alert("⚠️ Please fill in all fields to create a department and assign a HOD.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8800/api/superadmin/create-department",
        {
          dept_id: newDeptId,
          dept_name: newDeptName,
          faculty_id: selectedFaculty,
          hod_name: newHodName,
          hod_email: newHodEmail,
          hod_password: newHodPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Department created and HOD assigned successfully!");
      setNewDeptName("");
      setNewDeptId("");
      setSelectedFaculty("");
      setNewHodName("");
      setNewHodEmail("");
      setNewHodPassword("");
      fetchDepartments();
    } catch (error) {
      console.error("❌ Error creating department:", error);
      alert("❌ Failed to create department.");
    }
  };

  // const handleDeleteHOD = async () => {
  //   if (!selectedDepartment) {
  //     alert("⚠️ Please select a department to remove its HOD.");
  //     return;
  //   }
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`http://localhost:8800/api/superadmin/delete-hod/${selectedDepartment}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     alert("✅ HOD deleted successfully!");
  //     fetchProfessors(selectedDepartment);
  //   } catch (error) {
  //     console.error("❌ Error deleting HOD:", error);
  //     alert("❌ Failed to delete HOD.");
  //   }
  // };
  const handleDeleteHOD = async () => {
    if (!selectedDepartment) {
      alert("⚠️ Please select a department to remove its HOD.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8800/api/superadmin/department-hod/${selectedDepartment}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      const currentHodId = response.data.hodId;
  
      if (!currentHodId) {
        alert("⚠️ No HOD found for this department.");
        return;
      }
  
      await axios.delete(`http://localhost:8800/api/superadmin/delete-hod/${selectedDepartment}/${currentHodId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("✅ HOD deleted successfully!");
      fetchProfessors(selectedDepartment);
    } catch (error) {
      console.error("❌ Error deleting HOD:", error);
      alert("❌ Failed to delete HOD.");
    }
  };
  return (
    <>
      {/* Embedded CSS Styling */}
      <style>{`
        /* Global Styles */
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #e9ecef;
        }
        
        /* Outer Grid Layout: Header, Sidebar, Main Content */
        .super-admin-dashboard {
          display: grid;
          grid-template-columns: 240px 1fr;
          grid-template-rows: auto 1fr;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          background-color: #F3F4F6;
          color: #1E293B;
        }
        
        /* Top Header */
        .top-header {
  grid-column: 2 / -1;
  grid-row: 1;
  background-color: #ffffff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #CBD5E0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.back-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-sizing: border-box;
    height: 30px; 
  transform: translateZ(0);
  margin-top: -10px; 
}

.back-button:hover {
  background-color:rgb(197, 216, 236);
  /* Subtle brightness change */
  filter: brightness(110%); /* Increase brightness on hover */
}

.back-button:active {
 
  filter: brightness(90%);
}
        .university-name {
          margin: 0;
          font-size: 1.5rem;
        }
        
        /* Sidebar */
        .sidebar {
          grid-column: 1;
          grid-row: 1 / -1;
          background-color: #1F2937;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid #374151;
          color: #E5E7EB;
        }
        .user-icon {
          margin-bottom: 10px;
        }
        .user-name {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        .menu-options {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .menu-button {
          background-color: #2D3748;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          margin: 6px 0;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        .menu-button:hover {
          background-color: #4A5568;
        }
        
        /* Main Content */
        .main-content {
          grid-column: 2 / -1;
          grid-row: 2 / -1;
          padding: 20px;
          width: 100%;
          box-sizing: border-box;
          overflow-y: auto;
          background-color: #ffffff;
        }
        
        /* Section Styling */
        .section {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          width: 100%;
          max-width: 800px;
        }
        .section h3,
        .section h4 {
          margin-top: 0;
        }
        .section select,
        .section input {
          width: 100%;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        
        /* Button Styling */
        button {
          background-color: #007bff;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
          margin-right: 10px;
        }
        button:hover {
          background-color: #0056b3;
        }
        .delete-hod-button {
          background-color: #dc3545;
        }
        .delete-hod-button:hover {
          background-color: #a71d2a;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .super-admin-dashboard {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }
          .sidebar {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #374151;
          }
          .top-header {
            grid-column: 1;
          }
          .main-content {
            grid-column: 1;
            grid-row: 2;
            padding: 20px;
          }
        }
      `}</style>

      <div className="super-admin-dashboard">
        {/* Top Header */}
        <div className="top-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="university-name">Dharmshinh Desai University</h1>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <FaUserCircle size={50} className="user-icon" />
          <p className="user-name">{userName}</p>
          <div className="menu-options">
            <button className="menu-button" onClick={() => setActiveView("dashboard")}>
              Dashboard
            </button>
            <button className="menu-button" onClick={() => setActiveView("assignHod")}>
              Assign New HOD
            </button>
            <button className="menu-button" onClick={() => setActiveView("createDept")}>
              Create New Department
            </button>
            <button className="menu-button" onClick={() => navigate("/settings")}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeView === "dashboard" && (
            <div className="faculties-grid">
            {faculties.map((faculty) => (
                <div 
                    key={faculty.faculty_id} 
                    className="faculty-card"
                    onClick={() => navigate(`/departments/${faculty.faculty_id}`)}
                >
                    <div className="faculty-icon"></div>
                    <button className="faculty-name">{faculty.f_name}</button>
                </div>
            ))}
        </div>
          )}
          {activeView === "assignHod" && (
            <div className="section">
              <h3>Assign HOD</h3>
              <select
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  fetchProfessors(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
              <select value={selectedProfessor} onChange={(e) => setSelectedProfessor(e.target.value)}>
                <option value="">Select Professor</option>
                {professors.map((prof) => (
                  <option key={prof.user_id} value={prof.user_id}>
                    {prof.user_name} - {prof.user_email}
                  </option>
                ))}
              </select>
              <button onClick={handleAssignHOD}>Assign HOD</button>
              {/* <button onClick={handleDeleteHOD} className="delete-hod-button">
                Delete HOD
              </button> */}
            </div>
          )}
          {activeView === "createDept" && (
            <div className="section">
              <h3>Create New Department</h3>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty.faculty_id} value={faculty.faculty_id}>
                    {faculty.f_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Department ID"
                value={newDeptId}
                onChange={(e) => setNewDeptId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Department Name"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
              <h4>Assign New HOD</h4>
              <input
                type="text"
                placeholder="HOD Name"
                value={newHodName}
                onChange={(e) => setNewHodName(e.target.value)}
              />
              <input
                type="email"
                placeholder="HOD Email"
                value={newHodEmail}
                onChange={(e) => setNewHodEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="HOD Password"
                value={newHodPassword}
                onChange={(e) => setNewHodPassword(e.target.value)}
              />
              <button onClick={handleCreateDepartment}>
                Create Department & Assign HOD
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;


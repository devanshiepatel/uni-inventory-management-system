// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./SuperAdminDashboard.css";

// const SuperAdminDashboard = () => {
//     const [departments, setDepartments] = useState([]);
//     const [professors, setProfessors] = useState([]);
//     const [selectedDepartment, setSelectedDepartment] = useState("");
//     const [selectedProfessor, setSelectedProfessor] = useState("");
//     const [newDeptName, setNewDeptName] = useState("");
//     const [newDeptId, setNewDeptId] = useState("");
//     const [newHodName, setNewHodName] = useState("");
//     const [newHodEmail, setNewHodEmail] = useState("");
//     const [newHodPassword, setNewHodPassword] = useState("");
//     const [faculties, setFaculties] = useState([]); // ✅ Store faculty list
// const [selectedFaculty, setSelectedFaculty] = useState(""); // ✅ Store selected faculty

//     useEffect(() => {
//         fetchDepartments();
//     }, []);

//     const fetchDepartments = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("http://localhost:8800/api/departments", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setDepartments(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching departments:", error);
//         }
//     };

//     const fetchFaculties = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("http://localhost:8800/api/faculties", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setFaculties(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching faculties:", error);
//         }
//     };

//     fetchFaculties();

//     const fetchProfessors = async (deptId) => {
//         if (!deptId) return;
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get(`http://localhost:8800/api/professors/${deptId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setProfessors(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching professors:", error);
//         }
//     };

//     const handleAssignHOD = async () => {
//         if (!selectedDepartment || !selectedProfessor) {
//             alert("⚠️ Please select both a department and a professor.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.put("http://localhost:8800/api/superadmin/assign-hod", {
//                 dept_id: selectedDepartment,
//                 user_id: selectedProfessor,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("✅ HOD assigned successfully!");
//             setSelectedProfessor("");
//             fetchProfessors(selectedDepartment);
//         } catch (error) {
//             console.error("❌ Error assigning HOD:", error);
//             alert("❌ Failed to assign HOD.");
//         }
//     };
    

//     const handleCreateDepartment = async () => {
//         if (!newDeptName || !newDeptId || !selectedFaculty || !newHodName || !newHodEmail || !newHodPassword) {
//             alert("⚠️ Please fill in all fields to create a department and assign a HOD.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.post("http://localhost:8800/api/superadmin/create-department", {
//                 dept_id: newDeptId,
//                 dept_name: newDeptName,
//                 faculty_id: selectedFaculty, // 🔹 Include faculty_id
//                 hod_name: newHodName,
//                 hod_email: newHodEmail,
//                 hod_password: newHodPassword,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("✅ Department created and HOD assigned successfully!");
//             setNewDeptName("");
//             setNewDeptId("");
//             setSelectedFaculty("");
//             setNewHodName("");
//             setNewHodEmail("");
//             setNewHodPassword("");
//             fetchDepartments();
//         } catch (error) {
//             console.error("❌ Error creating department:", error);
//             alert("❌ Failed to create department.");
//         }
//     };

//     const handleDeleteHOD = async () => {
//         if (!selectedDepartment) {
//             alert("⚠️ Please select a department to remove its HOD.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`http://localhost:8800/api/superadmin/delete-hod/${selectedDepartment}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("✅ HOD deleted successfully!");
//             fetchProfessors(selectedDepartment);
//         } catch (error) {
//             console.error("❌ Error deleting HOD:", error);
//             alert("❌ Failed to delete HOD.");
//         }
//     };

//     return (
//         <div className="super-admin-dashboard">
//             <h2>Super Admin Dashboard</h2>

//             {/* Assign HOD Section */}
//             <div className="assign-hod-section">
//                 <h3>Assign HOD</h3>
//                 <select onChange={(e) => {
//                     setSelectedDepartment(e.target.value);
//                     fetchProfessors(e.target.value);
//                 }}>
//                     <option value="">Select Department</option>
//                     {departments.map((dept) => (
//                         <option key={dept.dept_id} value={dept.dept_id}>
//                             {dept.dept_name}
//                         </option>
//                     ))}
//                 </select>

//                 <select value={selectedProfessor} onChange={(e) => setSelectedProfessor(e.target.value)}>
//                     <option value="">Select Professor</option>
//                     {professors.map((prof) => (
//                         <option key={prof.user_id} value={prof.user_id}>
//                             {prof.user_name} - {prof.user_email}
//                         </option>
//                     ))}
//                 </select>

//                 <button onClick={handleAssignHOD}>Assign HOD</button>
//                 <button onClick={handleDeleteHOD}>Delete HOD</button>
//             </div>

//             {/* Create Department Section */}
//             <div className="create-department-section">
//                 <h3>Create New Department</h3>
//                 <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} required>
//     <option value="">Select Faculty</option>
//     {faculties.map((faculty) => (
//         <option key={faculty.faculty_id} value={faculty.faculty_id}>
//             {faculty.f_name}
//         </option>
//     ))}
// </select>
//                 <input type="text" placeholder="Department ID" value={newDeptId} onChange={(e) => setNewDeptId(e.target.value)} />
//                 <input type="text" placeholder="Department Name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} />
//                 <h4>Assign New HOD</h4>
//                 <input type="text" placeholder="HOD Name" value={newHodName} onChange={(e) => setNewHodName(e.target.value)} />
//                 <input type="email" placeholder="HOD Email" value={newHodEmail} onChange={(e) => setNewHodEmail(e.target.value)} />
//                 <input type="password" placeholder="HOD Password" value={newHodPassword} onChange={(e) => setNewHodPassword(e.target.value)} />

//                 <button onClick={handleCreateDepartment}>Create Department & Assign HOD</button>
//             </div>
//         </div>
//     );
// };

// export default SuperAdminDashboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SuperAdminDashboard = () => {
//     const [departments, setDepartments] = useState([]);
//     const [professors, setProfessors] = useState([]);
//     const [selectedDepartment, setSelectedDepartment] = useState("");
//     const [selectedProfessor, setSelectedProfessor] = useState("");
//     const [newDeptName, setNewDeptName] = useState("");
//     const [newDeptId, setNewDeptId] = useState("");
//     const [newHodName, setNewHodName] = useState("");
//     const [newHodEmail, setNewHodEmail] = useState("");
//     const [newHodPassword, setNewHodPassword] = useState("");
//     const [faculties, setFaculties] = useState([]); // Store faculty list
//     const [selectedFaculty, setSelectedFaculty] = useState(""); // Store selected faculty

//     useEffect(() => {
//         fetchDepartments();
//     }, []);

//     const fetchDepartments = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("http://localhost:8800/api/departments", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setDepartments(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching departments:", error);
//         }
//     };

//     const fetchFaculties = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("http://localhost:8800/api/faculties", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setFaculties(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching faculties:", error);
//         }
//     };

//     // Fetch faculties on every render (if desired you can move this into useEffect)
//     fetchFaculties();

//     const fetchProfessors = async (deptId) => {
//         if (!deptId) return;
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get(`http://localhost:8800/api/professors/${deptId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setProfessors(res.data);
//         } catch (error) {
//             console.error("❌ Error fetching professors:", error);
//         }
//     };

//     const handleAssignHOD = async () => {
//         if (!selectedDepartment || !selectedProfessor) {
//             alert("⚠️ Please select both a department and a professor.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.put(
//                 "http://localhost:8800/api/superadmin/assign-hod",
//                 {
//                     dept_id: selectedDepartment,
//                     user_id: selectedProfessor,
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             alert("✅ HOD assigned successfully!");
//             setSelectedProfessor("");
//             fetchProfessors(selectedDepartment);
//         } catch (error) {
//             console.error("❌ Error assigning HOD:", error);
//             alert("❌ Failed to assign HOD.");
//         }
//     };

//     const handleCreateDepartment = async () => {
//         if (
//             !newDeptName ||
//             !newDeptId ||
//             !selectedFaculty ||
//             !newHodName ||
//             !newHodEmail ||
//             !newHodPassword
//         ) {
//             alert("⚠️ Please fill in all fields to create a department and assign a HOD.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.post(
//                 "http://localhost:8800/api/superadmin/create-department",
//                 {
//                     dept_id: newDeptId,
//                     dept_name: newDeptName,
//                     faculty_id: selectedFaculty, // Include faculty_id
//                     hod_name: newHodName,
//                     hod_email: newHodEmail,
//                     hod_password: newHodPassword,
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             alert("✅ Department created and HOD assigned successfully!");
//             setNewDeptName("");
//             setNewDeptId("");
//             setSelectedFaculty("");
//             setNewHodName("");
//             setNewHodEmail("");
//             setNewHodPassword("");
//             fetchDepartments();
//         } catch (error) {
//             console.error("❌ Error creating department:", error);
//             alert("❌ Failed to create department.");
//         }
//     };

//     const handleDeleteHOD = async () => {
//         if (!selectedDepartment) {
//             alert("⚠️ Please select a department to remove its HOD.");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`http://localhost:8800/api/superadmin/delete-hod/${selectedDepartment}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             alert("✅ HOD deleted successfully!");
//             fetchProfessors(selectedDepartment);
//         } catch (error) {
//             console.error("❌ Error deleting HOD:", error);
//             alert("❌ Failed to delete HOD.");
//         }
//     };

//     return (
//         <>
//             {/* Embedded CSS styling */}
//             <style>{`
//                 /* Global Styles */
//                 body {
//                   margin: 0;
//                   padding: 0;
//                   font-family: Arial, sans-serif;
//                   background-color: #e9ecef;
//                 }
                
//                 /* Super Admin Dashboard Container */
//                 .super-admin-dashboard {
//                   display: flex;
//                   flex-direction: column;
//                   align-items: center;
//                   width: 100vw;
//                   min-height: 100vh;
//                   padding: 20px;
//                   background-color: #F3F4F6;
//                   box-sizing: border-box;
//                   color: #1E293B;
//                 }
                
//                 .super-admin-dashboard h2 {
//                   margin-bottom: 20px;
//                   font-size: 2rem;
//                 }
                
//                 /* Section Styling */
//                 .assign-hod-section,
//                 .create-department-section {
//                   background: #ffffff;
//                   padding: 20px;
//                   border-radius: 8px;
//                   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//                   margin-bottom: 20px;
//                   width: 100%;
//                   max-width: 800px;
//                 }
                
//                 .assign-hod-section h3,
//                 .create-department-section h3 {
//                   margin-top: 0;
//                 }
                
//                 .assign-hod-section select,
//                 .create-department-section select,
//                 .create-department-section input {
//                   width: 100%;
//                   padding: 10px;
//                   margin: 8px 0;
//                   border: 1px solid #ccc;
//                   border-radius: 5px;
//                   box-sizing: border-box;
//                 }
                
//                 /* Button Styling */
//                 button {
//                   background-color: #007bff;
//                   color: white;
//                   padding: 10px 16px;
//                   border: none;
//                   border-radius: 5px;
//                   cursor: pointer;
//                   font-size: 14px;
//                   transition: background-color 0.3s;
//                   margin-right: 10px;
//                 }
//                 button:hover {
//                   background-color: #0056b3;
//                 }
                
//                 /* Special button for Delete HOD (if needed) */
//                 .delete-hod-button {
//                   background-color: #dc3545;
//                 }
//                 .delete-hod-button:hover {
//                   background-color: #a71d2a;
//                 }
                
//                 /* Responsive adjustments */
//                 @media (max-width: 768px) {
//                   .super-admin-dashboard {
//                     padding: 10px;
//                   }
//                   .assign-hod-section,
//                   .create-department-section {
//                     width: 100%;
//                   }
//                 }
//             `}</style>

//             <div className="super-admin-dashboard">
//                 <h2>Super Admin Dashboard</h2>

//                 {/* Assign HOD Section */}
//                 <div className="assign-hod-section">
//                     <h3>Assign HOD</h3>
//                     <select
//                         onChange={(e) => {
//                             setSelectedDepartment(e.target.value);
//                             fetchProfessors(e.target.value);
//                         }}
//                     >
//                         <option value="">Select Department</option>
//                         {departments.map((dept) => (
//                             <option key={dept.dept_id} value={dept.dept_id}>
//                                 {dept.dept_name}
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         value={selectedProfessor}
//                         onChange={(e) => setSelectedProfessor(e.target.value)}
//                     >
//                         <option value="">Select Professor</option>
//                         {professors.map((prof) => (
//                             <option key={prof.user_id} value={prof.user_id}>
//                                 {prof.user_name} - {prof.user_email}
//                             </option>
//                         ))}
//                     </select>

//                     <button onClick={handleAssignHOD}>Assign HOD</button>
//                     <button onClick={handleDeleteHOD} className="delete-hod-button">
//                         Delete HOD
//                     </button>
//                 </div>

//                 {/* Create Department Section */}
//                 <div className="create-department-section">
//                     <h3>Create New Department</h3>
//                     <select
//                         value={selectedFaculty}
//                         onChange={(e) => setSelectedFaculty(e.target.value)}
//                         required
//                     >
//                         <option value="">Select Faculty</option>
//                         {faculties.map((faculty) => (
//                             <option key={faculty.faculty_id} value={faculty.faculty_id}>
//                                 {faculty.f_name}
//                             </option>
//                         ))}
//                     </select>
//                     <input
//                         type="text"
//                         placeholder="Department ID"
//                         value={newDeptId}
//                         onChange={(e) => setNewDeptId(e.target.value)}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Department Name"
//                         value={newDeptName}
//                         onChange={(e) => setNewDeptName(e.target.value)}
//                     />
//                     <h4>Assign New HOD</h4>
//                     <input
//                         type="text"
//                         placeholder="HOD Name"
//                         value={newHodName}
//                         onChange={(e) => setNewHodName(e.target.value)}
//                     />
//                     <input
//                         type="email"
//                         placeholder="HOD Email"
//                         value={newHodEmail}
//                         onChange={(e) => setNewHodEmail(e.target.value)}
//                     />
//                     <input
//                         type="password"
//                         placeholder="HOD Password"
//                         value={newHodPassword}
//                         onChange={(e) => setNewHodPassword(e.target.value)}
//                     />

//                     <button onClick={handleCreateDepartment}>
//                         Create Department & Assign HOD
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SuperAdminDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
          justify-content: space-between;
          border-bottom: 1px solid #CBD5E0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .back-button {
          background-color: transparent;
          color: #007bff;
          border: 2px solid #007bff;
          border-radius: 20px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s, color 0.3s;
        }
        .back-button:hover {
          background-color: #007bff;
          color: white;
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
            <div className="section">
              <h2>Faculties</h2>
              {faculties.length > 0 ? (
                <div>
                  {faculties.map((faculty) => (
                    <div key={faculty.faculty_id} style={{ padding: "10px 0", borderBottom: "1px solid #ccc" }}>
                      <strong>{faculty.f_name}</strong> (ID: {faculty.faculty_id})
                    </div>
                  ))}
                </div>
              ) : (
                <p>No faculties available.</p>
              )}
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


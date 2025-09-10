// // src/components/pages/Sprints.js
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SprintForm from "../forms/SprintForm";
// import { Plus, X, Trash2 } from "lucide-react";

// const Button = ({ children, onClick, type = "button", className }) => (
//   <button
//     type={type}
//     onClick={onClick}
//     className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md ${className}`}
//   >
//     {children}
//   </button>
// );

// const Sprints = () => {
//   const [sprints, setSprints] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchSprints = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("http://192.168.12.224:5001/api/sprints", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSprints(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch sprints");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSprints();
//   }, [token]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sprint?")) return;
//     try {
//       await axios.delete(`http://192.168.12.224:5001/api/sprints/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSprints((prev) => prev.filter((s) => s.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete sprint");
//     }
//   };

//   return (
//     <div className="p-6 bg-green-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <h2 className="text-4xl font-extrabold text-green-800">Sprint Office</h2>
//         <Button
//           onClick={() => setShowCreateModal(true)}
//           className="bg-gradient-to-r from-green-600 to-green-400 text-white hover:from-green-700 hover:to-green-500 flex items-center gap-2"
//         >
//           <Plus size={18} /> New Sprint
//         </Button>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <p className="text-gray-500">Loading sprints...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : sprints.length === 0 ? (
//         <p className="text-gray-500">No sprints found. Create one to get started.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sprints.map((s) => (
//             <div
//               key={s.id}
//               className="relative bg-gradient-to-tr from-green-100 via-green-50 to-green-200 rounded-xl p-5 shadow-md transform hover:scale-105 hover:shadow-xl transition-all duration-300"
//             >
//               <button
//                 onClick={() => handleDelete(s.id)}
//                 className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
//               >
//                 <Trash2 size={18} />
//               </button>
//               <h3 className="text-2xl font-bold text-green-800 mb-2 truncate">
//                 {s.name}
//               </h3>
//               <p className="text-gray-700 text-sm truncate">
//                 {s.description || "No description available."}
//               </p>
//               <div className="mt-3 text-gray-500 text-xs">
//                 Project: <span className="font-semibold">{s.project_name}</span>
//               </div>
//               <div className="mt-1 text-gray-500 text-xs">
//                 {new Date(s.start_date).toLocaleDateString()} -{" "}
//                 {new Date(s.end_date).toLocaleDateString()}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="relative bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl border-t-4 border-green-600">
//             <button
//               onClick={() => setShowCreateModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
//             >
//               <X size={20} />
//             </button>
//             <h3 className="text-3xl font-bold mb-6 text-green-700">
//               Create Sprint
//             </h3>
//             <SprintForm
//               closeModal={() => setShowCreateModal(false)}
//               setSprints={setSprints}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sprints;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllSprints = () => {
//   const [sprints, setSprints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   const formatDate = (isoString) => {
//     if (!isoString) return "-";
//     const date = new Date(isoString);
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
//       date.getDate()
//     ).padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     const fetchSprints = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("http://192.168.12.224:5001/api/sprints", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSprints(Array.isArray(res.data.data) ? res.data.data : []);
//       } catch (err) {
//         console.error("Error fetching sprints:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSprints();
//   }, [token]);

//   const getStatusBadge = (status) => {
//     const s = (status || "").toLowerCase();
//     if (s === "planned")
//       return (
//         <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
//           Planned
//         </span>
//       );
//     if (s === "active")
//       return (
//         <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
//           Active
//         </span>
//       );
//     if (s === "completed")
//       return (
//         <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold text-sm">
//           Completed
//         </span>
//       );
//     return (
//       <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
//         N/A
//       </span>
//     );
//   };

//   const getRowClass = (status) => {
//     const s = (status || "").toLowerCase();
//     if (s === "planned") return "bg-blue-50 hover:bg-blue-100";
//     if (s === "active") return "bg-green-50 hover:bg-green-100";
//     if (s === "completed") return "bg-gray-100 hover:bg-gray-200";
//     return "bg-white hover:bg-gray-50";
//   };

//   if (loading) return <p>Loading all sprints...</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">All Sprints</h2>

//       {sprints.length === 0 ? (
//         <p className="text-gray-500">No sprints found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
//           <table className="min-w-full border-collapse">
//             <thead className="bg-purple-50">
//               <tr>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">Title</th>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">Project</th>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">Start</th>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">End</th>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">Due</th>
//                 <th className="py-2 px-4 text-left font-medium text-gray-700 border-b">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sprints.map((sprint) => (
//                 <tr key={sprint.id} className={`${getRowClass(sprint.status)} transition`}>
//                   <td className="py-2 px-4 font-medium text-gray-800">{sprint.title}</td>
//                   <td className="py-2 px-4 text-gray-700">{sprint.project_name}</td>
//                   <td className="py-2 px-4 text-gray-700">{formatDate(sprint.start_date)}</td>
//                   <td className="py-2 px-4 text-gray-700">{formatDate(sprint.end_date)}</td>
//                   <td className="py-2 px-4 text-gray-700">{formatDate(sprint.due_date)}</td>
//                   <td className="py-2 px-4">{getStatusBadge(sprint.status)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllSprints;

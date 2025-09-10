// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Trash2 } from 'lucide-react';

// const Sprints = ({ setSprints }) => {
//   const [sprints, setLocalSprints] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [filteredSprints, setFilteredSprints] = useState([]);
//   const token = localStorage.getItem("token");

//   // Fetch sprints
//   useEffect(() => {
//     axios.get("http://192.168.12.224:5001/api/sprints", { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => {
//         setLocalSprints(res.data);
//         setSprints(res.data);
//         setFilteredSprints(res.data);
//       })
//       .catch(err => console.error(err));
//   }, [token, setSprints]);

//   // Apply status filter
//   const applyFilter = () => {
//     const filtered = statusFilter ? sprints.filter(s => s.status === statusFilter) : sprints;
//     setFilteredSprints(filtered);
//   };

//   const deleteSprint = async id => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(`http://192.168.12.224:5001/api/sprints/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setLocalSprints(prev => prev.filter(s => s.id !== id));
//       setSprints(prev => prev.filter(s => s.id !== id));
//       setFilteredSprints(prev => prev.filter(s => s.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Sprint Office</h2>

//       {/* Status Filter */}
//       <div className="flex justify-end mb-4 items-center gap-4">
//         <label>Status:</label>
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="">All</option>
//           <option value="planned">Planned</option>
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//         </select>
//         <button
//           onClick={applyFilter}
//           className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* Sprints Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">Title</th>
//               <th className="px-4 py-2">Project</th>
//               <th className="px-4 py-2">Start Date</th>
//               <th className="px-4 py-2">End Date</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSprints.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No sprints found.</td>
//               </tr>
//             ) : (
//               filteredSprints.map(s => (
//                 <tr key={s.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">{s.title}</td>
//                   <td className="px-4 py-2">{s.project_name || '-'}</td>
//                   <td className="px-4 py-2">{s.start_date}</td>
//                   <td className="px-4 py-2">{s.end_date}</td>
//                   <td className="px-4 py-2">{s.status}</td>
//                   <td className="px-4 py-2">
//                     <button onClick={() => deleteSprint(s.id)} className="text-red-600 flex items-center gap-1">
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Sprints;

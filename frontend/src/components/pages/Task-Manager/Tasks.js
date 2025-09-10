// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Trash2 } from 'lucide-react';

// const Tasks = ({ setTasks }) => {
//   const [tasks, setLocalTasks] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const token = localStorage.getItem("token");

//   // Fetch tasks
//   useEffect(() => {
//     axios.get("http://192.168.12.224:5001/api/tasks", { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => {
//         setLocalTasks(res.data);
//         setTasks(res.data);
//         setFilteredTasks(res.data);
//       })
//       .catch(err => console.error(err));
//   }, [token, setTasks]);

//   // Apply status filter
//   const applyFilter = () => {
//     const filtered = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;
//     setFilteredTasks(filtered);
//   };

//   const deleteTask = async id => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(`http://192.168.12.224:5001/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setLocalTasks(prev => prev.filter(t => t.id !== id));
//       setTasks(prev => prev.filter(t => t.id !== id));
//       setFilteredTasks(prev => prev.filter(t => t.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Task Office</h2>

//       {/* Status Filter */}
//       <div className="flex justify-end mb-4 items-center gap-4">
//       <label>Status:</label>
//       <select
//         value={statusFilter}
//         onChange={e => setStatusFilter(e.target.value)}
//         className="border px-2 py-1 rounded"
//       >
//       <option value="">All</option>
//       <option value="planned">Planned</option>
//       <option value="active">Active</option>
//       <option value="completed">Completed</option>
//       </select>
//       <button 
//         onClick={applyFilter} 
//         className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//       >
//         Apply Filter
//       </button>
// </div>

//       {/* Tasks Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">Title</th>
//               <th className="px-4 py-2">Sprint</th>
//               <th className="px-4 py-2">Project</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Assignee</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No tasks found.</td>
//               </tr>
//             ) : (
//               filteredTasks.map(t => (
//                 <tr key={t.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">{t.title}</td>
//                   <td className="px-4 py-2">{t.sprint_title || '-'}</td>
//                   <td className="px-4 py-2">{t.project_name || '-'}</td>
//                   <td className="px-4 py-2">{t.status}</td>
//                   <td className="px-4 py-2">{t.assignee_id || '-'}</td>
//                   <td className="px-4 py-2">
//                     <button onClick={() => deleteTask(t.id)} className="text-red-600 flex items-center gap-1">
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

// export default Tasks;

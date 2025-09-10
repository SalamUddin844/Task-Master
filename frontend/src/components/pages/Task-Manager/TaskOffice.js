// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const TaskOffice = () => {
//   const [tasks, setTasks] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     axios.get("http://192.168.12.224:5001/api/tasks", { headers: { Authorization: `Bearer ${token}` } })
//       .then(res => setTasks(res.data))
//       .catch(err => console.error(err));
//   }, [token]);

//   const filteredTasks = statusFilter ? tasks.filter(t => t.status === statusFilter) : tasks;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Task Office</h2>

//       <div className="mb-4">
//         <label className="mr-2">Filter by Status:</label>
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="">All</option>
//           <option value="todo">To Do</option>
//           <option value="in-progress">In Progress</option>
//           <option value="done">Done</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">Task ID</th>
//               <th className="px-4 py-2">Title</th>
//               <th className="px-4 py-2">Sprint ID</th>
//               <th className="px-4 py-2">Project Name</th>
//               <th className="px-4 py-2">Start Date</th>
//               <th className="px-4 py-2">End Date</th>
//               <th className="px-4 py-2">Due Date</th>
//               <th className="px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTasks.map(t => (
//               <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
//                 <td className="px-4 py-2">{t.id}</td>
//                 <td className="px-4 py-2">{t.title}</td>
//                 <td className="px-4 py-2">{t.sprint_id}</td>
//                 <td className="px-4 py-2">{t.project_name}</td>
//                 <td className="px-4 py-2">{t.start_date}</td>
//                 <td className="px-4 py-2">{t.end_date}</td>
//                 <td className="px-4 py-2">{t.due_date}</td>
//                 <td className="px-4 py-2">{t.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TaskOffice;

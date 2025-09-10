// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import SprintForm from "../forms/SprintForm"; 
// import { Plus, X, Trash2 } from "lucide-react";

// const ProjectSprints = () => {
//   const { projectId } = useParams();
//   const [project, setProject] = useState(null);
//   const [sprints, setSprints] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!projectId) return;
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch project details
//         const projectRes = await axios.get(`http://192.168.12.224:5001/api/projects/${projectId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProject(projectRes.data);

//         // Fetch sprints of the project
//         const sprintsRes = await axios.get(`http://192.168.12.224:5001/api/sprints/project/${projectId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSprints(sprintsRes.data);
//       } catch (err) {
//         console.error("Error fetching project or sprints:", err.response || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [projectId, token]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this sprint?")) return;

//     try {
//       await axios.delete(`http://192.168.12.224:5001/api/sprints/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSprints((prev) => prev.filter((s) => s.id !== id));
//     } catch (err) {
//       console.error("Error deleting sprint:", err.response || err.message);
//       alert("Failed to delete sprint");
//     }
//   };

//   if (loading) return <p className="p-6">Loading project and sprints...</p>;
//   if (!project) return <p className="p-6 text-red-500">Project not found.</p>;

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">
//           {project.name} - Sprints
//         </h2>
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
//         >
//           <Plus size={18} /> Create Sprint
//         </button>
//       </div>

//       {/* Sprint Table */}
//       <div className="overflow-x-auto">
//         {sprints.length === 0 ? (
//           <p className="text-gray-500">No sprints found for this project.</p>
//         ) : (
//           <table className="min-w-full border border-gray-200 rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2">Sprint ID</th>
//                 <th className="px-4 py-2">Title</th>
//                 <th className="px-4 py-2">Start Date</th>
//                 <th className="px-4 py-2">End Date</th>
//                 <th className="px-4 py-2">Due Date</th>
//                 <th className="px-4 py-2">Status</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sprints.map((s) => (
//                 <tr
//                   key={s.id}
//                   className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
//                   onClick={() => navigate(`/sprints/${s.id}/tasks`)}
//                 >
//                   <td className="px-4 py-2">{s.id}</td>
//                   <td className="px-4 py-2">{s.title}</td>
//                   <td className="px-4 py-2">{s.start_date || "-"}</td>
//                   <td className="px-4 py-2">{s.end_date || "-"}</td>
//                   <td className="px-4 py-2">{s.due_date || "-"}</td>
//                   <td className="px-4 py-2">{s.status}</td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(s.id);
//                       }}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Create Sprint Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
//             <button
//               onClick={() => setShowCreateModal(false)}
//               className="absolute top-2 right-2"
//             >
//               <X size={18} />
//             </button>
//             <h3 className="text-xl font-semibold mb-4">Create Sprint</h3>
//             <SprintForm
//               project={project}
//               setSprints={setSprints}
//               closeModal={() => setShowCreateModal(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectSprints;

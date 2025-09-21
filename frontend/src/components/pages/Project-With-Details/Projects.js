import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProjectForm from "../forms/ProjectForm";
import { X, Trash2, Eye } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../modals/ConfirmationModal";
import BACKEND_API from "../../../config";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_API}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Use fetchProjects in useEffect
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Search filter
  useEffect(() => {
    let temp = [...projects];
    if (searchText.trim() !== "") {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredProjects(temp);
  }, [searchText, projects]);

  // Open delete confirmation
  const confirmDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axios.delete(
        `${BACKEND_API}/projects/${projectToDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleEdit = (project) => {    
    setEditingProject(project);  
    setShowModal(true);
  };
   
  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-900">Projects List</h1>
    <button
      onClick={() => {
        setEditingProject(null);
        setShowModal(true);
      }}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
    >
      + New Project
    </button>
  </div>

  {/* Search */}
  <div className="mb-5">
    <div className="relative w-full sm:w-1/2">
      <input
        type="text"
        placeholder="🔍 Search projects..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Project Table */}
  {loading ? (
    <p className="text-center text-gray-500">Loading projects...</p>
  ) : filteredProjects.length === 0 ? (
    <div className="text-center py-10 text-gray-500">No projects found ✨</div>
  ) : (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            {["Name", "Description", "Created At", "Actions"].map((header) => (
              <th key={header} className="py-3 px-4 text-left border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-gray-50 transition border-b last:border-0"
            >
              <td className="py-3 px-4 font-medium text-gray-700">{p.name}</td>
              <td className="py-3 px-4 text-gray-600 truncate">
                {p.description || "-"}
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 flex gap-3">
                {/* View */}
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="text-gray-500 hover:text-blue-600 transition"
                  title="View Project"
                >
                  <Eye size={16} />
                </button>
                {/* Edit */}
                <button
                  onClick={() => handleEdit(p)}
                  className="text-gray-500 hover:text-green-600 transition"
                  title="Edit Project"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                </button>
                {/* Delete */}
                <button
                  onClick={() => confirmDeleteProject(p)}
                  className="text-gray-500 hover:text-red-600 transition"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Project Form Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
        <button
          onClick={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>
        <ProjectForm
          closeModal={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          setProjects={setProjects}
          projects={projects}
          editingProject={editingProject}
          fetchProjects={fetchProjects}
        />
      </div>
    </div>
  )}

  {/* Delete Confirmation Modal */}
  <ConfirmationModal
    isOpen={showDeleteModal}
    title="Delete Project?"
    message={`Are you sure you want to delete "${projectToDelete?.name}"?`}
    onConfirm={handleConfirmDelete}
    onCancel={() => setShowDeleteModal(false)}
    confirmText="Yes"
    cancelText="No"
  />
</div>

  );
};

export default Projects;

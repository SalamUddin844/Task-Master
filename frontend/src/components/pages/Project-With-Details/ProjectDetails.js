import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Trash2, Eye } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import SprintForm from "../forms/SprintForm";
import ConfirmationModal from "../../modals/ConfirmationModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_BASE_URL;

  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [filteredSprints, setFilteredSprints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState(null);

  // Format date safely
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Fetch project details
  useEffect(() => {
    if (!projectId) return;
    setLoadingProject(true);

    axios
      .get(`${API}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProject(res.data))
      .catch((err) => console.error("Error fetching project:", err))
      .finally(() => setLoadingProject(false));
  }, [API, projectId, token]);

  // Fetch sprints
  const fetchSprints = useCallback(async () => {
    setLoadingSprints(true);
    try {
      const res = await axios.get(`${API}/sprints/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setSprints(data);
      setFilteredSprints(data);
    } catch (err) {
      console.error("Error fetching sprints:", err);
    } finally {
      setLoadingSprints(false);
    }
  }, [API, projectId, token]);

  useEffect(() => {
    if (projectId) fetchSprints();
  }, [projectId, fetchSprints]);

  // Filter & search sprints safely
  useEffect(() => {
    let temp = [...sprints];

    if (filterStatus !== "all") {
      temp = temp.filter(
        (s) => (s.status || "").toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      temp = temp.filter((s) =>
        (s.title || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredSprints(temp);
  }, [filterStatus, searchText, sprints]);

  // Add or update sprint
  const handleAddSprint = (newSprint) => {
    if (editingSprint) {
      setSprints((prev) =>
        prev.map((s) => (s.id === newSprint.id ? newSprint : s))
      );
    } else {
      setSprints((prev) => [...prev, newSprint]);
    }
  };

  // Delete sprint
  const confirmDeleteSprint = (sprint) => {
    setSprintToDelete(sprint);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!sprintToDelete) return;

    try {
      await axios.delete(`${API}/sprints/${sprintToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSprints((prev) => prev.filter((s) => s.id !== sprintToDelete.id));
    } catch (err) {
      console.error("Failed to delete sprint:", err);
    } finally {
      setShowDeleteModal(false);
      setSprintToDelete(null);
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "in_progress":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
            In Progress
          </span>
        );
      case "active":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold text-sm">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">
            N/A
          </span>
        );
    }
  };

  if (loadingProject)
    return <div className="p-6 text-center text-gray-700">Loading project...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {project?.title || "Sprint List"}
        </h1>
        <button
          onClick={() => {
            setEditingSprint(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
        >
          + New Sprint
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
        <input
          type="text"
          placeholder="🔍 Search sprints..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-1/2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-1/4 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="in_progress">In Progress</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Sprint Table */}
      {loadingSprints ? (
        <p className="text-center text-gray-500">Loading sprints...</p>
      ) : filteredSprints.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No sprints found ✨</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                {["Title", "Start", "Due", "Status", "Actions"].map((header) => (
                  <th key={header} className="py-3 px-4 text-left border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSprints.map((sprint) => (
                <tr
                  key={sprint.id}
                  className="hover:bg-gray-50 transition border-b last:border-0"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {sprint.title || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatDate(sprint.start_date)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatDate(sprint.due_date)}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(sprint.status)}</td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/projects/${projectId}/sprints/${sprint.id}`)
                      }
                      className="text-gray-500 hover:text-blue-600 transition"
                      title="View Sprint"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSprint(sprint);
                        setShowModal(true);
                      }}
                      className="text-gray-500 hover:text-green-600 transition"
                      title="Edit Sprint"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDeleteSprint(sprint)}
                      className="text-gray-500 hover:text-red-600 transition"
                      title="Delete Sprint"
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

      {/* Sprint Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-xl">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingSprint(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
            <SprintForm
              fetchSprints={fetchSprints}
              project={project}
              setSprints={handleAddSprint}
              editingSprint={editingSprint}
              closeModal={() => {
                setShowModal(false);
                setEditingSprint(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Sprint?"
        message={`Are you sure you want to delete "${sprintToDelete?.title || "-"}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default ProjectDetails;

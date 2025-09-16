import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Trash2, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import TaskForm from "../forms/TaskForm";
import ConfirmationModal from "../../modals/ConfirmationModal";


const SprintTask = () => {
  const { projectId, sprintId } = useParams();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const API = process.env.REACT_APP_API_BASE_URL;
  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        const sprintTasks = sprintId
          ? res.data.filter((t) => String(t.sprint_id) === String(sprintId))
          : res.data;

        // Attach assignee names
        const tasksWithNames = sprintTasks.map((task) => {
          const assignee = users.find((u) => u.id === task.assignee_id);
          return { ...task, assignee_name: assignee ? assignee.name : task.assignee_name };
        });

        setTasks(tasksWithNames);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [API,token, sprintId, users]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
    }
  }, [API,token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { if (users.length) fetchTasks(); }, [fetchTasks, users]);

  // Open delete confirmation modal
  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await axios.delete(`${API}/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    } catch (err) {
      console.error("Failed to delete task:", err.response?.data || err.message);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  // Add or update task locally
  const handleAddOrUpdateTask = (task) => {
    const assignee = users.find((u) => u.id === task.assignee_id);
    const taskWithName = { ...task, assignee_name: assignee ? assignee.name : task.assignee_name };

    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = taskWithName;
        return updated;
      }
      return [...prev, taskWithName];
    });
  };

  // Format date
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "-";

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status?.toLowerCase() === statusFilter;
    const matchesSearch = task.assignee_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Status badge classes
  const getStatusBadge = (status) => {
    if (!status) return "bg-gray-100 text-gray-800 font-semibold text-sm";
    switch (status.toLowerCase()) {
      case "done": return "bg-green-100 text-green-800 font-semibold text-sm";
      case "in-progress": return "bg-yellow-100 text-yellow-800 font-semibold text-sm";
      case "todo": return "bg-red-100 text-red-800 font-semibold text-sm";
      default: return "bg-gray-100 text-gray-800 font-semibold text-sm";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
    <button
      onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
    >
      + New Task
    </button>
  </div>

  {/* Filters */}
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
    <div className="flex items-center gap-2">
      <label className="font-medium text-gray-700">Status:</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <input
      type="text"
      placeholder="🔍 Search by assignee..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border rounded-lg px-3 py-2 w-full md:w-72 text-sm focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Task Table */}
  {loading ? (
    <p className="text-gray-500">Loading tasks...</p>
  ) : filteredTasks.length === 0 ? (
    <div className="text-center py-10 text-gray-500">No tasks found ✨</div>
  ) : (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            {[
              "Title",
              "Description",
              "Start",
              "End",
              "Status",
              "Assignee",
              "Estimation",
              "Priority",
              "Actions",
            ].map((header) => (
              <th key={header} className="py-3 px-4 text-left border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {filteredTasks.map((task) => (
    <tr
      key={task.id}
      className="hover:bg-gray-50 transition border-b last:border-0"
    >
      <td className="py-3 px-4 font-medium text-gray-800">
        {task.title}
      </td>
      <td className="py-3 px-4 text-gray-600">
        {task.description}
      </td>
      <td className="py-3 px-4 text-gray-600">
        {formatDate(task.start_date)}
      </td>
      <td className="py-3 px-4 text-gray-600">
        {formatDate(task.end_date)}
      </td>
      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full font-medium text-sm ${getStatusBadge(
            task.status
          )}`}
        >
          {task.status || "-"}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-800 font-medium">
        {task.assignee_name || "-"}
      </td>
      <td className="py-3 px-4 text-gray-600">
        {task.time_estimation || "-"} hr
      </td>
      <td className="py-3 px-4 text-gray-600">
        {task.priority || "-"}
      </td>
      <td className="py-3 px-4 flex gap-3">
        <button
          onClick={() => {
            setEditingTask(task);
            setShowTaskModal(true);
          }}
          className="text-gray-500 hover:text-blue-600 transition"
          title="Edit Task"
        >
          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
        </button>
        <button
          onClick={() => confirmDeleteTask(task)}
          className="text-gray-500 hover:text-red-600 transition"
          title="Delete Task"
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

  {/* Task Modal */}
  {showTaskModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-xl">
        <button
          onClick={() => setShowTaskModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>
        <TaskForm
          fetchTasks={fetchTasks}
          sprint={{ id: sprintId }}
          project={{ id: projectId }}
          setTasks={handleAddOrUpdateTask}
          closeModal={() => setShowTaskModal(false)}
          editingTask={editingTask}
        />
      </div>
    </div>
  )}

  {/* Confirmation Modal */}
  <ConfirmationModal
    isOpen={showDeleteModal}
    title="Delete Task?"
    message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
    onConfirm={handleConfirmDelete}
    onCancel={() => setShowDeleteModal(false)}
    confirmText="Yes"
    cancelText="No"
  />
</div>
  );
};

export default SprintTask;

import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ sprint, closeModal, fetchTasks, editingTask, setTasks }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "todo",
    assigneeId: "",
    timeEstimation: "",
    priority: "Normal",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_BASE_URL;

  // Populate form if editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        startDate: editingTask.start_date || "",
        endDate: editingTask.end_date || "",
        status: editingTask.status || "todo",
        assigneeId: editingTask.assignee_id || "",
        timeEstimation: editingTask.time_estimation || "",
        priority: editingTask.priority || "Normal",
      });
    }
  }, [editingTask]);

  // Fetch users for assignee dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [API, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError("Task title is required");
    if (!sprint?.id) return setError("Sprint ID is missing");

    setLoading(true);
    setError("");

    const payload = {
      sprint_id: sprint.id,
      title: formData.title,
      description: formData.description,
      start_date: formData.startDate || null,
      end_date: formData.endDate || null,
      status: formData.status,
      assignee_id: formData.assigneeId || null,
      time_estimation: formData.timeEstimation || null,
      priority: formData.priority,
    };

    try {
      if (editingTask) {
        await axios.put(`${API}/tasks/${editingTask.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? { id: editingTask.id, ...payload } : t))
        );
      } else {
        const res = await axios.post(`${API}/tasks`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks((prev) => [...prev, { id: res.data.id, ...payload }]);
      }

      fetchTasks();
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-1 font-sans text-sm bg-white p-2 rounded-xl"
    >
      <h2 className="text-xl font-medium text-gray-700 mb-2">
        {editingTask ? "Edit Task" : "Create New Task"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-2 py-1 rounded-lg mb-2">{error}</p>
      )}

      {/* Task Title */}
      <div className="flex flex-col mb-1">
        <label htmlFor="title" className="text-gray-700 text-sm mb-1 px-1">
          Task Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Task Description */}
      <div className="flex flex-col mb-1">
        <label htmlFor="description" className="text-gray-700 text-sm mb-1 px-1">
          Task Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[10px]"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-gray-700 text-sm mb-1 px-1">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-gray-700 text-sm mb-1 px-1">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col mb-1">
        <label htmlFor="status" className="text-gray-700 text-sm mb-1 px-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Assignee */}
      <div className="flex flex-col mb-1">
        <label htmlFor="assigneeId" className="text-gray-700 text-sm mb-1 px-1">
          Assignee
        </label>
        <select
          id="assigneeId"
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">--Select Assignee--</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name || u.email}
            </option>
          ))}
        </select>
      </div>

      {/* Time Estimation */}
      <div className="flex flex-col mb-1">
        <label htmlFor="timeEstimation" className="text-gray-700 text-sm mb-1 px-1">
          Time Estimation (hrs)
        </label>
        <input
          id="timeEstimation"
          name="timeEstimation"
          type="number"
          min="1"
          placeholder="Time Estimation"
          value={formData.timeEstimation}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col mb-1">
        <label htmlFor="priority" className="text-gray-700 text-sm mb-1 px-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (editingTask ? "Saving..." : "Creating...") : editingTask ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

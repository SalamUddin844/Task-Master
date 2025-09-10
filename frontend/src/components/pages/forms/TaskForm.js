import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ sprint, closeModal, fetchTasks, editingTask, setTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [assigneeId, setAssigneeId] = useState("");
  const [timeEstimation, setTimeEstimation] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE = "http://192.168.12.224:5001/api/tasks";

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setStartDate(editingTask.start_date || "");
      setEndDate(editingTask.end_date || "");
      setStatus(editingTask.status || "todo");
      setAssigneeId(editingTask.assignee_id || "");
      setTimeEstimation(editingTask.time_estimation || "");
      setPriority(editingTask.priority || "Normal");
    }
  }, [editingTask]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://192.168.12.224:5001/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is required");
    if (!sprint?.id) return setError("Sprint ID is missing");

    setLoading(true);
    setError("");

    try {
      const payload = { sprint_id: sprint.id, title, description, start_date: startDate || null, end_date: endDate || null, status, assignee_id: assigneeId || null, time_estimation: timeEstimation || null, priority };
      let res;
      if (editingTask) {
        res = await axios.put(`${API_BASE}/${editingTask.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        const updatedTask = { id: editingTask.id, ...payload };
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      } else {
        res = await axios.post(API_BASE, payload, { headers: { Authorization: `Bearer ${token}` } });
        const newTask = { id: res.data.id, ...payload };
        setTasks((prev) => [...prev, newTask]);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-base bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">{editingTask ? "Edit Task" : "Create New Task"}</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">--Select Assignee--</option>
        {users.map((u) => (<option key={u.id} value={u.id}>{u.name || u.email}</option>))}
      </select>

      <input type="number" min="1" placeholder="Time Estimation (hrs)" value={timeEstimation} onChange={(e) => setTimeEstimation(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="Urgent">Urgent</option>
        <option value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
      </select>

      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition">Cancel</button>
        <button type="submit" disabled={loading} className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
          {loading ? (editingTask ? "Saving..." : "Creating...") : editingTask ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

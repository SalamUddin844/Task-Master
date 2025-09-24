import { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_API from "../../../config";

const SprintForm = ({ project, closeModal, setSprints, fetchSprints, editingSprint }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingSprint) {
      setTitle(editingSprint?.title || "");
      setStartDate(editingSprint?.start_date || "");
      setDueDate(editingSprint?.due_date || "");
      setStatus(editingSprint?.status || "in_progress");
    } else {
      setTitle("");
      setStartDate("");
      setDueDate("");
      setStatus("in_progress");
    }
  }, [editingSprint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Sprint title is required");

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        project_id: project?.id,
        start_date: startDate || null,
        due_date: dueDate || null,
        status,
      };

      let res;
      if (editingSprint) {
        res = await axios.put(
          `${BACKEND_API}/sprints/${editingSprint?.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          `${BACKEND_API}/sprints`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const sprintData = res?.data?.data || res?.data;

      fetchSprints();

      setSprints((prev) =>
        editingSprint
          ? prev.map((s) => (s.id === sprintData?.id ? sprintData : s))
          : [...prev, sprintData]
      );

      closeModal();
    } catch (err) {
      console.error(err?.response || err);
      setError("Failed to save sprint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 font-sans text-base bg-white p-6 rounded-2xl"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {editingSprint ? "Edit Sprint" : "Create New Sprint"}
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
      <label for="title" className="block text-gray-700 text-sm mb-0.5">Sprint Title</label>
      <input
        type="text"
        placeholder="Sprint Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <label for="startDate" className="block text-gray-700 text-sm mb-0.5">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <label for="dueDate" className="block text-gray-700 text-sm mb-0.5">Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label for="status" className="block text-gray-700 text-sm mb-0.5">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="in_progress">In Progress</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex justify-end gap-3 mt-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : editingSprint ? "Save Changes" : "Create Sprint"}
        </button>
      </div>
    </form>
  );
};

export default SprintForm;

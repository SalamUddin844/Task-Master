import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectForm = ({ closeModal, setProjects, editingProject, fetchProjects }) => {
  const [project, setProject] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editingProject) {
      setProject({
        name: editingProject.name || "",
        description: editingProject.description || "",
      });
    } else {
      setProject({ name: "", description: "" });
    }
  }, [editingProject]);

  const handleChange = (e) => setProject({ ...project, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project.name.trim()) return setError("Project name is required");

    setLoading(true);
    setError("");
    try {
      let data;
      if (editingProject) {
        const res = await axios.put(
          `http://192.168.12.224:5001/api/projects/${editingProject.id}`,
          project,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        data = res.data;
        setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      } else {
        const res = await axios.post(
          "http://192.168.12.224:5001/api/projects",
          project,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        data = res.data;
        setProjects((prev) => [...prev, data]);
      }

      fetchProjects();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-base bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">{editingProject ? "Edit Project" : "Create New Project"}</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <input
        type="text"
        name="name"
        value={project.name}
        onChange={handleChange}
        placeholder="Project Name"
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <textarea
        name="description"
        value={project.description}
        onChange={handleChange}
        placeholder="Project Description"
        rows={4}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end gap-3 mt-2">
        <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button type="submit" disabled={loading} className={`px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
          {loading ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;

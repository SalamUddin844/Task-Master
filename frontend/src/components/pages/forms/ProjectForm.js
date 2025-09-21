import { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_API from "../../../config";

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
          `${BACKEND_API}/projects/${editingProject.id}`,
          project,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        data = res.data;
        setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      } else {
        const res = await axios.post(
          `${BACKEND_API}/projects`,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 font-sans text-base bg-white p-6 rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800">{editingProject ? "Edit Project" : "Create New Project"}</h2>
      {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <label for="name" className="text-gray-700 text-sm mb-0.5">Project Name</label>
      <input
        type="text"
        name="name"
        value={project.name}
        onChange={handleChange}
        placeholder="Project Name"
        className="border border-gray-300 p-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <label for="description" className=" text-gray-700 text-sm mb-0.5">Project Description</label>
      <textarea
        name="description"
        value={project.description}
        onChange={handleChange}
        placeholder="Project Description"
        rows={4}
        className="border border-gray-300 p-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end gap-3 mt-3">
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

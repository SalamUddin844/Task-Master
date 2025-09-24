import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FolderOpen, CheckSquare, Calendar } from "lucide-react";
import BACKEND_API from "../../../config";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // const today = new Date();
  const userId = Number(JSON.parse(localStorage.getItem("user"))?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("No auth token found. Please log in.");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [projectsRes, sprintsRes, tasksRes] = await Promise.all([
          axios.get(`${BACKEND_API}/projects`, config),
          axios.get(`${BACKEND_API}/sprints`, config),
          axios.get(`${BACKEND_API}/tasks`, config),
        ]);

        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setSprints(
          Array.isArray(sprintsRes.data)
            ? sprintsRes.data
            : Array.isArray(sprintsRes.data.data)
            ? sprintsRes.data.data
            : []
        );
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Unknown error");
      }
    };

    fetchData();
  }, []);

  const totalProjects = projects.length;
  const totalSprints = sprints.length;
  const totalTasks = tasks.length;

  const myTasks = tasks.filter((t) => t?.assignee_id === userId);
  const mySprintIds = [...new Set(myTasks.map((t) => t?.sprint_id))];
  const mySprints = sprints.filter((s) => mySprintIds.includes(s?.id));
  const myProjectIds = [...new Set(mySprints.map((s) => s?.project_id))];
  const myProjects = projects.filter((p) => myProjectIds.includes(p?.id));

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="container mx-auto px-4">
        {error && (
          <p className="text-red-500 mb-6 text-center font-medium">{error}</p>
        )}

        {/* ---------------- Overall Activities ---------------- */}
        <h1 className="text-2xl font-extrabold text-gray-700 mb-6">
          Overall Activities
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Projects"
            value={totalProjects}
            icon={<FolderOpen size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-400"
            onClick={() => navigate("/projects")}
          />
          <StatCard
            title="Total Sprints"
            value={totalSprints}
            icon={<Calendar size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-purple-500 to-purple-400"
            onClick={() => navigate("/sprint-office")}
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={<CheckSquare size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-green-500 to-green-400"
            onClick={() => navigate("/task-office")}
          />
        </div>

        {/* ---------------- My Activities ---------------- */}
        <h1 className="text-2xl font-extrabold text-gray-700 mb-6">
          My Activities
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard
            title="My Projects"
            value={myProjects.length}
            icon={<FolderOpen size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-400"
          />
          <StatCard
            title="My Sprints"
            value={mySprints.length}
            icon={<Calendar size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-purple-500 to-purple-400"
          />
          <StatCard
            title="My Tasks"
            value={myTasks.length}
            icon={<CheckSquare size={28} className="text-white" />}
            bgColor="bg-gradient-to-r from-green-500 to-green-400"
          />
        </div>
      </div>
    </div>
  );
};

// ---------------- Reusable StatCard Component ----------------
const StatCard = ({ title, value, icon, bgColor, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer bg-white"
  >
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
    <div
      className={`p-4 rounded-full flex items-center justify-center ${bgColor}`}
    >
      {icon}
    </div>
  </div>
);

export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FolderOpen, CheckSquare, Calendar, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [error, setError] = useState("");
  const today = new Date();

  const userId = Number(JSON.parse(localStorage.getItem("user"))?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No auth token found. Please log in.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const API = "http://192.168.12.224:5001";

        const [projectsRes, sprintsRes, tasksRes] = await Promise.all([
          axios.get(`${API}/api/projects`, config),
          axios.get(`${API}/api/sprints`, config),
          axios.get(`${API}/api/tasks`, config),
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
        console.error("Failed to fetch dashboard data:", err.response || err);
        setError(err.response?.data?.message || err.message || "Unknown error");
      }
    };

    fetchData();
  }, []);

  // Overall Activities calculations
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const activeSprints = sprints.filter(
    (s) => s.status?.toLowerCase() === "active"
  ).length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < today
  ).length;

  // My Activities: tasks assigned to current user
  const myTasks = tasks.filter((t) => t.assignee_id === userId);

  const myActivities = myTasks.map((task) => {
    const project = projects.find((p) => p.id === task.project_id);
    const sprint = sprints.find((s) => s.id === task.sprint_id);
    return {
      ...task,
      projectName: project?.name || "-",
      sprintName: sprint?.name || "-",
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Overall Activities */}
        <h1 className="text-xl font-semibold text-gray-700 mb-4">
          Overall Activities
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Projects"
            value={totalProjects}
            icon={<FolderOpen className="text-blue-600" size={24} />}
            bgColor="bg-blue-100"
            textColor="text-gray-800"
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={<CheckSquare className="text-green-600" size={24} />}
            bgColor="bg-green-100"
            textColor="text-green-700"
          />
          <StatCard
            title="Active Sprints"
            value={activeSprints}
            icon={<Calendar className="text-purple-600" size={24} />}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
          />
          <StatCard
            title="Overdue Tasks"
            value={overdueTasks}
            icon={<AlertCircle className="text-red-600" size={24} />}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
        </div>

        {/* My Activities */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Activities</h2>
        {myActivities.length === 0 ? (
          <p className="text-gray-500 mb-6">You have no assigned tasks.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {myActivities.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-5 shadow hover:shadow-lg transition transform hover:scale-105 ${
                  task.due_date && new Date(task.due_date) < today ? "border-l-4 border-red-500" : ""
                }`}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{task.name}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Project:</span> {task.projectName}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Sprint:</span> {task.sprintName}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Due Date:</span>{" "}
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
                </p>
                <p
                  className={`font-semibold ${
                    task.status?.toLowerCase() === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {task.status || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className="relative bg-white rounded-xl p-5 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className={`text-2xl md:text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    </div>
  </div>
);

export default Dashboard;

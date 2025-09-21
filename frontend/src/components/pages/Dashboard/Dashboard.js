import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FolderOpen, CheckSquare, Calendar, AlertCircle } from "lucide-react";
import BACKEND_API from "../../../config";

const Dashboard = () => {
  // ---------------- State ----------------
  const [projects, setProjects] = useState([]);   // All projects
  const [sprints, setSprints] = useState([]);     // All sprints
  const [tasks, setTasks] = useState([]);         // All tasks
  const [error, setError] = useState("");         // Error handling

  const today = new Date();
  const navigate = useNavigate();

  // Get logged-in user ID
  const userId = Number(JSON.parse(localStorage.getItem("user"))?.id);

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No auth token found. Please log in.");
          return;
        }

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
        console.error("Failed to fetch dashboard data:", err.response || err);
        setError(err.response?.data?.message || err.message || "Unknown error");
      }
    };

    fetchData();
  }, []);

  
  // ---------------- Overall Activities ----------------
  const totalProjects = projects.length;
  const totalSprints = sprints.length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(
    (t) => t?.due_date && new Date(t.due_date) < today
  ).length;

  // console.log("userId:", userId);
  // if(userId===tasks.assignee_id) {
  //   return console.log("matched");
  // }
  // ---------------- My Activities ----------------
  const myTasks = tasks.filter((t) => t?.assignee_id === userId); 
  // match kortesi user id er sathe task table er assignee_id er sathe
  // console.log("My Tasks:", myTasks);
  const mySprintIds = [...new Set(myTasks.map((t) => t?.sprint_id))];
  // console.log("My Sprint IDs:", mySprintIds);
  const mySprints = sprints.filter((s) => mySprintIds.includes(s?.id));
  // console.log("My Sprints:", mySprints);
  const myProjectIds = [...new Set(mySprints.map((s) => s?.project_id))];
  // console.log("My Project IDs:", myProjectIds);
  const myProjects = projects.filter((p) => myProjectIds.includes(p?.id));
  // console.log("My Projects:", myProjects);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* ---------------- Overall Activities ---------------- */}
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
            onClick={() => navigate("/projects")}
          />
          <StatCard
            title="Total Sprints"
            value={totalSprints}
            icon={<Calendar className="text-purple-600" size={24} />}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
            onClick={() => navigate("/sprint-office")}
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            icon={<CheckSquare className="text-green-600" size={24} />}
            bgColor="bg-green-100"
            textColor="text-green-700"
            onClick={() => navigate("/task-office")}
          />
          <StatCard
            title="Overdue Tasks"
            value={overdueTasks}
            icon={<AlertCircle className="text-red-600" size={24} />}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
        </div>

        {/* ---------------- My Activities ---------------- */}
        <h1 className="text-xl font-semibold text-gray-700 mb-4">
          My Activities
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="My Projects"
            value={myProjects.length}
            icon={<FolderOpen className="text-blue-600" size={24} />}
            bgColor="bg-blue-100"
            textColor="text-gray-800"
          />
          <StatCard
            title="My Sprints"
            value={mySprints.length}
            icon={<Calendar className="text-purple-600" size={24} />}
            bgColor="bg-purple-100"
            textColor="text-purple-700"
          />
          <StatCard
            title="My Tasks"
            value={myTasks.length}
            icon={<CheckSquare className="text-green-600" size={24} />}
            bgColor="bg-green-100"
            textColor="text-green-700"
          />
        </div>
      </div>
    </div>
  );
};

// ---------------- Reusable StatCard Component ----------------
const StatCard = ({ title, value, icon, bgColor, textColor, onClick }) => (
  <div
    onClick={onClick}
    className="relative bg-white rounded-xl p-5 shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
  >
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

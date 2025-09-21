import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CreateModal from "./modals/modal";
import BACKEND_API from "../config";

const PolygonBoard = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({ name: "", role: "" });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [notifications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token) return; 
    if (!user || !user.role) return; 

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Base requests for all users
        const [projectsRes, tasksRes, sprintsRes] = await Promise.all([
          axios.get(`${BACKEND_API}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_API}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_API}/sprints`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProjects(projectsRes.data || []);
        setTasks(tasksRes.data || []);
        setSprints(sprintsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err.response || err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          setShowCreateModal={setShowCreateModal}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading data...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <Outlet
              context={{ tasks, setTasks, projects, setProjects, sprints, setSprints }}
            />
          )}
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          setShowCreateModal={setShowCreateModal}
          tasks={tasks}
          setTasks={setTasks}
          projects={projects}
          setProjects={setProjects}
          sprints={sprints}
          setSprints={setSprints}
        />
      )}
    </div>
  );
};

export default PolygonBoard;

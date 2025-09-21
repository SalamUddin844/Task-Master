import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, TrendingUp } from "lucide-react";
import BACKEND_API from "../../../config";

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [team, setTeam] = useState([]);
  const [searchText, setSearchText] = useState(""); 
  const token = localStorage.getItem("token");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, sprintsRes, teamRes] = await Promise.all([
          axios.get(`${BACKEND_API}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_API}/sprints`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_API}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setTasks(tasksRes.data);
        setSprints(sprintsRes.data);
        setTeam(teamRes.data);
      } catch (err) {
        console.error("Failed to fetch reports data:", err);
      }
    };

    fetchData();
  }, [token]);

  // Calculate task completion rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  // Team performance data
  const performanceData = team
    .map((member) => {
      const memberTasks = tasks.filter((t) => t.assignee_id === member.id);
      const completed = memberTasks.filter((t) => t.status === "done").length;
      const rate = memberTasks.length ? `${((completed / memberTasks.length) * 100).toFixed(0)}%` : "0%";

      return {
        name: member.name || member.email,
        completed,
        total: memberTasks.length,
        rate,
      };
    })
    // Filter by search text
    .filter((member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Reports & Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Completion Rate Card */}
        <div className="bg-gradient-to-tr from-gray-100 via-gray-50 to-gray-200 p-6 rounded-xl shadow-md border-t-4 border-gray-600 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Task Completion Rate</h3>
          <div className="h-64 flex flex-col items-center justify-center text-gray-700">
            <BarChart3 size={48} />
            <span className="mt-2 text-3xl font-bold">{completionRate}%</span>
            <span className="text-sm text-gray-700 mt-1">{completedTasks} of {totalTasks} tasks completed</span>
          </div>
        </div>

        {/* Sprint Burndown Card */}
        <div className="bg-gradient-to-tr from-gray-100 via-gray-50 to-gray-200 p-6 rounded-xl shadow-md border-t-4 border-gray-600 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Sprint Burndown</h3>
          <div className="h-64 flex flex-col items-center justify-center text-gray-700">
            <TrendingUp size={48} />
            <span className="mt-2 text-sm">Burndown chart placeholder</span>
            <span className="text-xs mt-1 text-gray-700">{sprints.length} active sprints</span>
          </div>
        </div>
      </div>

      {/* Team Performance Table Card */}
      <div className="p-6 rounded-xl shadow-md border-t-4 border-gray-600 hover:shadow-xl transition-all duration-300 bg-white">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Performance Analysis</h3>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by team member name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">Team Member</th>
                <th className="text-left py-3 px-4">Tasks Completed</th>
                <th className="text-left py-3 px-4">Total Tasks</th>
                <th className="text-left py-3 px-4">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No team member found.
                  </td>
                </tr>
              ) : (
                performanceData.map((member, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{member.name}</td>
                    <td className="py-3 px-4 text-gray-700">{member.completed}</td>
                    <td className="py-3 px-4 text-gray-700">{member.total}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{member.rate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

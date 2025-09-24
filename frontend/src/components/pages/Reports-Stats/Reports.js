import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3 } from "lucide-react";
import BACKEND_API from "../../../config";

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [searchText, setSearchText] = useState(""); 
  const token = localStorage.getItem("token");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, teamRes] = await Promise.all([
          axios.get(`${BACKEND_API}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BACKEND_API}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setTasks(tasksRes.data);
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
    .filter((member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800">Reports & Analytics</h2>

      {/* Task Completion Rate Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-tr from-blue-500 to-blue-400 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center">
          <BarChart3 size={50} />
          <span className="mt-4 text-4xl font-bold">{completionRate}%</span>
          <span className="text-sm mt-1">{completedTasks} of {totalTasks} tasks completed</span>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Team Performance</h3>

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by team member name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Team Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tasks Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Tasks</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No team member found.
                  </td>
                </tr>
              ) : (
                performanceData.map((member, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">{member.name}</td>
                    <td className="py-3 px-4 text-gray-700">{member.completed}</td>
                    <td className="py-3 px-4 text-gray-700">{member.total}</td>
                    <td className="py-3 px-4 text-gray-800 font-semibold">{member.rate}</td>
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

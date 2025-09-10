import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, TrendingUp } from "lucide-react";

const Reports = () => {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [team, setTeam] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, sprintsRes, teamRes] = await Promise.all([
          axios.get("http://192.168.12.224:5001/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://192.168.12.224:5001/api/sprints", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://192.168.12.224:5001/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
  const performanceData = team.map((member) => {
    const memberTasks = tasks.filter((t) => t.assignee_id === member.id);
    const completed = memberTasks.filter((t) => t.status === "done").length;
    const active = memberTasks.filter((t) => t.status !== "done").length;
    const rate = memberTasks.length ? `${((completed / memberTasks.length) * 100).toFixed(0)}%` : "0%";

    return {
      name: member.name || member.email,
      completed,
      active,
      rate,
    };
  });

  return (
    <div className="p-6 bg-blue-50 min-h-screen font-sans">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-800">Reports & Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Completion Rate Card */}
        <div className="bg-gradient-to-tr from-blue-100 via-blue-50 to-blue-200 p-6 rounded-xl shadow-md border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-blue-800">Task Completion Rate</h3>
          <div className="h-64 flex flex-col items-center justify-center text-blue-700">
            <BarChart3 size={48} />
            <span className="mt-2 text-3xl font-bold">{completionRate}%</span>
            <span className="text-sm text-blue-700 mt-1">{completedTasks} of {totalTasks} tasks completed</span>
          </div>
        </div>

        {/* Sprint Burndown Card */}
        <div className="bg-gradient-to-tr from-blue-100 via-blue-50 to-blue-200 p-6 rounded-xl shadow-md border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold mb-4 text-blue-800">Sprint Burndown</h3>
          <div className="h-64 flex flex-col items-center justify-center text-blue-700">
            <TrendingUp size={48} />
            <span className="mt-2 text-sm">Burndown chart placeholder</span>
            <span className="text-xs mt-1 text-blue-700">{sprints.length} active sprints</span>
          </div>
        </div>
      </div>

      {/* Team Performance Table Card */}
      <div className="bg-gradient-to-tr from-blue-100 via-blue-50 to-blue-200 p-6 rounded-xl shadow-md border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-bold mb-4 text-blue-800">Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left py-3 px-4">Team Member</th>
                <th className="text-left py-3 px-4">Tasks Completed</th>
                <th className="text-left py-3 px-4">Active Tasks</th>
                <th className="text-left py-3 px-4">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((member, index) => (
                <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium text-blue-800">{member.name}</td>
                  <td className="py-3 px-4 text-blue-700">{member.completed}</td>
                  <td className="py-3 px-4 text-blue-700">{member.active}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{member.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

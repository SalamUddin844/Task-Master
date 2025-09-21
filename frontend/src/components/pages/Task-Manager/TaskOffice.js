import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash, X } from "lucide-react";
import ConfirmationModal from "../../modals/ConfirmationModal";
import TaskOfficeModal from "../../modals/taskOfficeModal";
import BACKEND_API from "../../../config";

const TaskOffice = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch tasks
  useEffect(() => {
    axios
      .get(`${BACKEND_API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (id) => {
    axios
      .delete(`${BACKEND_API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setShowModal(false);
        setShowConfirm(false);
        setSelectedTask(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Tasks</h2>

      {/* Task Table */}
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border text-left text-gray-700">Title</th>
            <th className="p-3 border text-center text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="p-3 border text-sm text-gray-700">{task.title}</td>
              <td className="p-3 border text-center">
                <button
                  onClick={() => handleViewTask(task)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Task Modal */}
      {selectedTask && (
        <TaskOfficeModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="relative space-y-4">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedTask(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>

            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <p><strong>Sprint:</strong> {selectedTask.sprint_name || "N/A"}</p>
              <p><strong>Project:</strong> {selectedTask.project_name || "N/A"}</p>
              <p>
                <strong>Start:</strong>{" "}
                {selectedTask.start_date
                  ? new Date(selectedTask.start_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {selectedTask.end_date
                  ? new Date(selectedTask.end_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {selectedTask.due_date
                  ? new Date(selectedTask.due_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p><strong>Status:</strong> {selectedTask.status || "N/A"}</p>
              <p><strong>Assignee:</strong> {selectedTask.assignee_name || "N/A"}</p>
              <p><strong>Time Estimation:</strong> {selectedTask.time_estimation || "N/A"}</p>
              <p><strong>Priority:</strong> {selectedTask.priority || "N/A"}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                <Trash size={16} /> Delete
              </button>
            </div>
          </div>
        </TaskOfficeModal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={() => handleDeleteTask(selectedTask.id)}
        onCancel={() => setShowConfirm(false)}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default TaskOffice;

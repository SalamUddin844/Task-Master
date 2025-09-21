import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash, X } from "lucide-react";
import ConfirmationModal from "../../modals/ConfirmationModal";
import TaskOfficeModal from "../../modals/taskOfficeModal";
import BACKEND_API from "../../../config";

const SprintOffice = () => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch sprints
  useEffect(() => {
    axios
      .get(`${BACKEND_API}/sprints`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("BACKEND_API response:", res.data);
        setSprints(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleViewSprint = (sprint) => {
    setSelectedSprint(sprint);
    setShowModal(true);
  };

  const handleDeleteSprint = (id) => {
    axios
      .delete(`${BACKEND_API}/sprints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSprints((prev) => prev.filter((s) => s.id !== id));
        setShowModal(false);
        setShowConfirm(false);
        setSelectedSprint(null);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Sprints</h2>

      {/* Sprint Table */}
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border text-left text-gray-700">Title</th>
            <th className="p-3 border text-center text-gray-700">View Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="text-center p-4">
                Loading sprints...
              </td>
            </tr>
          ) : sprints.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center p-4">
                No sprints found.
              </td>
            </tr>
          ) : (
            sprints.map((sprint) => (
              <tr key={sprint.id} className="hover:bg-gray-50">
                <td className="p-3 border text-sm text-gray-700">{sprint.title}</td>
                <td className="p-3 border text-center text-gray-700">
                  <button
                    onClick={() => handleViewSprint(sprint)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Sprint Modal */}
      {selectedSprint && (
        <TaskOfficeModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="relative space-y-4">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedSprint(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-bold text-gray-900">{selectedSprint.title}</h2>

            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <p>
                <strong>Project:</strong> {selectedSprint.project_name || "N/A"}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {selectedSprint.start_date
                  ? new Date(selectedSprint.start_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {selectedSprint.due_date
                  ? new Date(selectedSprint.due_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedSprint.status || "N/A"}
              </p>
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
        title="Delete Sprint"
        message="Are you sure you want to delete this sprint?"
        onConfirm={() => handleDeleteSprint(selectedSprint.id)}
        onCancel={() => setShowConfirm(false)}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
};

export default SprintOffice;

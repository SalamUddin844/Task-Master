import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import InviteUserForm from "../forms/TeamMemberForm";
import axios from "axios";

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");

  // Fetch team members
  const fetchMembers = useCallback(async () => {
    try {
      const res = await axios.get("http://192.168.12.224:5001/api/team/invite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      console.error("Failed to fetch team members:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Search filter
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter((m) =>
          m.name.toLowerCase().includes(searchText.toLowerCase()) ||
          m.email.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, members]);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Team Members</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
        >
          Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Table */}
      {filteredMembers.length === 0 ? (
        <p className="text-gray-500 py-6 text-center">No team members found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Role", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-4 font-medium text-gray-700 border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="bg-white hover:bg-gray-50 transition border-b last:border-0"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{member.name}</td>
                  <td className="py-3 px-4 text-gray-600 truncate">{member.email}</td>
                  <td className="py-3 px-4 text-gray-600">{member.role}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      // onClick={() => handleDelete(member.id)}
                      className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl animate-modalOpen">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Invite Member</h3>
            <InviteUserForm
              closeModal={() => setShowModal(false)}
              setTeamMembers={setMembers}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;

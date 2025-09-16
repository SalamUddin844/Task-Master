import React, { useState } from "react";
import axios from "axios";

const TeamMemberForm = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get token if you need authentication (optional for LAN test)
  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API}/team/invite`,
        { email },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      setMessage(res.data.message);
      setEmail("");

      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border rounded-lg px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded-lg"
      >
        {loading ? "Sending Invite..." : "Send Invite"}
      </button>

      {message && <p className="text-green-500">{message}</p>}
    </form>
  );
};

export default TeamMemberForm;

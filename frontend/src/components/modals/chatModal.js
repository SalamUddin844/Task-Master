import{ useEffect, useState } from "react";
import axios from "axios";
import BACKEND_API from "../../config";

const ChatModal = ({ isOpen, onClose, selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch messages between currentUser & selectedUser
  useEffect(() => {
    if (!isOpen || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(
          `${BACKEND_API}/chat/messages/${selectedUser.id}`,
          config
        );

        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isOpen, selectedUser]);

  // 🔹 Send a new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.post(
        `${BACKEND_API}/chat/messages`,
        {
          receiver_id: selectedUser.id,
          message: newMessage,
        },
        config
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Chat with {selectedUser.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-3 space-y-2">
          {loading ? (
            <p className="text-gray-500 text-center">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender_id === currentUser.id
                    ? "ml-auto bg-indigo-100 text-indigo-800"
                    : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex items-center border-t pt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

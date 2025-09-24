import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Smile, Paperclip, Send } from "lucide-react";
import BACKEND_API from "../../../config";

const LiveChat = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/messages/users`, config);
        setUsers(res.data.filter((u) => u.id !== currentUser.id));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  // Fetch messages when user selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_API}/messages/${selectedUser.id}`,
          config
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch messages");
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await axios.post(
        `${BACKEND_API}/messages`,
        {
          receiver_id: selectedUser.id,
          message: newMessage,
        },
        config
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-600">Live Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                selectedUser?.id === user.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {user.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user.lastMessage || "Click to chat"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
          {selectedUser ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {selectedUser.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chat</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {selectedUser ? (
            messages.length ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs shadow ${
                      msg.sender_id === currentUser.id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-[10px] text-gray-300 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-10">
                No messages yet. Start chatting!
              </p>
            )
          ) : (
            <p className="text-gray-400 text-center mt-10">
              Select a user from the sidebar to start chat
            </p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
            <button className="text-gray-500 hover:text-blue-600">
              <Smile size={22} />
            </button>
            <button className="text-gray-500 hover:text-blue-600">
              <Paperclip size={22} />
            </button>
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LiveChat;

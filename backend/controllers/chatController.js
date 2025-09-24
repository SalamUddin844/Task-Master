const db = require("../database/connectdb"); // your MySQL connection

// Get all users except self
async function getUsers(req, res) {
  const userId = req.user.id;
  db.query("SELECT id, name, email FROM users WHERE id != ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
}

// Get messages between two users
async function getMessages(req, res) {
  const { userId } = req.params;
  const currentUser = req.user.id;

  db.query(
    "SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at ASC",
    [currentUser, userId, userId, currentUser],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
}

// Send message
const sendMessage = async () => {
  if (!newMessage) return;

  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const body = {
      receiverId: selectedUser.id,
      message: newMessage,
    };

    const res = await axios.post(`${BACKEND_API}/messages`, body, config);

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  } catch (err) {
    console.error("Send message error:", err.response || err);
    alert("Failed to send message");
  }
};

module.exports = { getUsers, getMessages, sendMessage };

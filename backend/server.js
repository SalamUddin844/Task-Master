const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./database/.env" });

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/sprints", require("./routes/sprintRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/users", require("./routes/userRoute"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server on all network interfaces
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT} and accessible on the network at http://192.168.12.224:${PORT}`)
);
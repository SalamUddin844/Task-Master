const db = require("../database/connectdb");

// -------------------- GET ALL TASKS --------------------
exports.getTasks = (req, res) => {
  const query = `
    SELECT 
      t.id,
      t.sprint_id,
      t.title,
      t.description,
      t.start_date,
      t.end_date,
      t.due_date,
      t.status,
      t.assignee_id,
      u.name AS assignee_name, 
      t.time_estimation,
      t.priority,
      s.title AS sprint_name,
      p.name AS project_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN sprints s ON t.sprint_id = s.id
    LEFT JOIN projects p ON s.project_id = p.id
    ORDER BY t.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// -------------------- GET TASKS BY SPRINT --------------------
exports.getTasksBySprint = (req, res) => {
  const { sprintId } = req.params;

  const query = `
    SELECT 
      t.id,
      t.sprint_id,
      t.title,
      t.description,
      t.start_date,
      t.end_date,
      t.due_date,
      t.status,
      t.assignee_id,
      u.name AS assignee_name,
      t.time_estimation,
      t.priority
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.sprint_id = ?
    ORDER BY t.start_date DESC
  `;

  db.query(query, [sprintId], (err, results) => {
    if (err) {
      console.error("Error fetching sprint tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// -------------------- CREATE TASK --------------------
exports.createTask = (req, res) => {
  const {
    sprint_id,
    title,
    description,
    start_date,
    end_date,
    due_date,
    status,
    assignee_id,
    time_estimation,
    priority,
  } = req.body;

  if (!title || !sprint_id) {
    return res.status(400).json({ error: "Title and sprint_id are required" });
  }

  const getAssigneeNameQuery = assignee_id
    ? "SELECT name FROM users WHERE id = ?"
    : null;

  const insertTask = (assignee_name = null) => {
    const query = `
      INSERT INTO tasks 
      (sprint_id, title, description, start_date, end_date, due_date, status, assignee_id, assignee_name, time_estimation, priority) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      sprint_id,
      title,
      description || null,
      start_date || null,
      end_date || null,
      due_date || null,
      status || "todo",
      assignee_id || null,
      assignee_name,
      time_estimation || null,
      priority || "Normal",
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Return the full created task
      db.query(
        "SELECT t.id, t.sprint_id, t.title, t.description, t.start_date, t.end_date, t.due_date, t.status, t.assignee_id, u.name AS assignee_name, t.time_estimation, t.priority FROM tasks t LEFT JOIN users u ON t.assignee_id = u.id WHERE t.id = ?",
        [result.insertId],
        (err2, tasks) => {
          if (err2) return res.status(500).json({ error: "Database error" });
          res.status(201).json(tasks[0]);
        }
      );
    });
  };

  if (getAssigneeNameQuery) {
    db.query(getAssigneeNameQuery, [assignee_id], (err, result) => {
      if (err) {
        console.error("Error fetching assignee:", err);
        return res.status(500).json({ error: "Database error" });
      }
      insertTask(result[0]?.name || null);
    });
  } else {
    insertTask(null);
  }
};

// -------------------- UPDATE TASK --------------------
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const {
    sprint_id,
    title,
    description,
    start_date,
    end_date,
    due_date,
    status,
    assignee_id,
    time_estimation,
    priority,
  } = req.body;

  const getAssigneeNameQuery = assignee_id
    ? "SELECT name FROM users WHERE id = ?"
    : null;

  const updateTask = (assignee_name = null) => {
    const query = `
      UPDATE tasks 
      SET sprint_id=?, title=?, description=?, start_date=?, end_date=?, due_date=?, 
          status=?, assignee_id=?, assignee_name=?, time_estimation=?, priority=?
      WHERE id=?
    `;
    const values = [
      sprint_id,
      title,
      description || null,
      start_date || null,
      end_date || null,
      due_date || null,
      status || "todo",
      assignee_id || null,
      assignee_name,
      time_estimation || null,
      priority || "Normal",
      id,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Return the updated task
      db.query(
        "SELECT t.id, t.sprint_id, t.title, t.description, t.start_date, t.end_date, t.due_date, t.status, t.assignee_id, u.name AS assignee_name, t.time_estimation, t.priority FROM tasks t LEFT JOIN users u ON t.assignee_id = u.id WHERE t.id = ?",
        [id],
        (err2, tasks) => {
          if (err2) return res.status(500).json({ error: "Database error" });
          res.json(tasks[0]);
        }
      );
    });
    
  };

  if (getAssigneeNameQuery) {
    db.query(getAssigneeNameQuery, [assignee_id], (err, result) => {
      if (err) {
        console.error("Error fetching assignee:", err);
        return res.status(500).json({ error: "Database error" });
      }
      updateTask(result[0]?.name || null);
    });
  } else {
    updateTask(null);
  }
};

// -------------------- DELETE TASK --------------------
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  });
};

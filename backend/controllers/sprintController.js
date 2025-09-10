const db = require("../database/connectdb");

// Get all sprints
exports.getSprints = (req, res) => {
  const query = `
    SELECT s.*, p.name AS project_name 
    FROM sprints s
    JOIN projects p ON s.project_id = p.id
    ORDER BY s.start_date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching sprints:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, data: results });
  });
};

// Get sprints by project
exports.getSprintsByProject = (req, res) => {
  const { projectId } = req.params;
  const query = `
    SELECT s.*, p.name AS project_name 
    FROM sprints s
    JOIN projects p ON s.project_id = p.id
    WHERE s.project_id = ?
    ORDER BY s.start_date DESC
  `;
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error("Error fetching sprints by project:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, data: results });
  });
};

// Create sprint
exports.createSprint = (req, res) => {
  // console.log("Create Sprint Body:", req.body);

  const { title, project_id, start_date, end_date, due_date, status } = req.body;

  if (!title || !project_id) {
    return res.status(400).json({ success: false, message: "Title and project_id are required" });
  }

  const query = `
    INSERT INTO sprints (title, project_id, start_date, end_date, due_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, project_id, start_date || null, end_date || null, due_date || null, status || "planned"],
    (err, result) => {
      if (err) {
        console.error("Error inserting sprint:", err.sqlMessage);
        return res.status(500).json({ success: false, message: err.sqlMessage });
      }

      res.status(201).json({
        success: true,
        message: "Sprint created successfully",
        data: {
          id: result.insertId,
          title,
          project_id,
          start_date,
          end_date,
          due_date,
          status: status || "planned",
        },
      });
    }
  );
};

// Update sprint
exports.updateSprint = (req, res) => {
  const { title, start_date, end_date, due_date, status } = req.body;
  const { id } = req.params;

  const query = `
    UPDATE sprints SET title=?, start_date=?, end_date=?, due_date=?, status=? WHERE id=?
  `;
  db.query(query, [title, start_date, end_date, due_date, status, id], (err, result) => {
    if (err) {
      console.error("Error updating sprint:", err.sqlMessage);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Sprint not found" });
    res.json({ success: true, message: "Sprint updated" });
  });
};

// Delete sprint
exports.deleteSprint = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM sprints WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting sprint:", err.sqlMessage);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Sprint not found" });
    res.json({ success: true, message: "Sprint deleted" });
  });
};

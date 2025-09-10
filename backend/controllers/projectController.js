const db = require("../database/connectdb");

exports.getProjects = (req, res) => {
  /// console.log("Fetching projects");
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
exports.getProjectById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM projects WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ error: "Project not found" });
    res.json(result[0]);
  });
};

exports.createProject = (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ error: "Name and description required" });

  db.query(
    "INSERT INTO projects (name, description) VALUES (?, ?)",
    [name, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name, description });
    }
  );
};

exports.updateProject = (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE projects SET name=?, description=? WHERE id=?",
    [name, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });
      res.json({ message: "Project updated" });
    }
  );
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM projects WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  });
};

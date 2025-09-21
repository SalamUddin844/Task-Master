// const db = require("../database/db");

// // Get tasks for the logged-in user
// const getMyActivities = async (req, res) => {
//   try {
//     // Assuming you have user ID from auth middleware
//     const userId = req.user.id;

//     const [tasks] = await db.execute(`
//       SELECT 
//           t.id AS task_id,
//           t.title AS task_title,
//           t.status AS task_status,
//           t.priority AS task_priority,
//           s.id AS sprint_id,
//           s.title AS sprint_title,
//           p.id AS project_id,
//           p.name AS project_name
//       FROM tasks t
//       LEFT JOIN sprints s ON t.sprint_id = s.id
//       LEFT JOIN projects p ON t.project_id = p.id
//       WHERE t.assignee_id = ?
//       ORDER BY p.id, s.id, t.id
//     `, [userId]);

//     res.json(tasks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch activities" });
//   }
// };

// module.exports = { getMyActivities };

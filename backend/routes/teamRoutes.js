// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const { inviteUser } = require("../controllers/teamController");
const { CheckAuthorization } = require("../middleware/authorization");

// POST /api/teams/invite
router.post("/invite",CheckAuthorization,inviteUser);

module.exports = router;

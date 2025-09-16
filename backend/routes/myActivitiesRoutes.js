const express = require("express");
const router = express.Router();
const { getMyActivities } = require("../controllers/myActivitiesController");
const authMiddleware = require("../middleware/authorization");

router.get("/", authMiddleware, getMyActivities);

module.exports = router;

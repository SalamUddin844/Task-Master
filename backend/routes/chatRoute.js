// routes/chatRoute.js
const express = require("express");
const router = express.Router();
const { getUsers, getMessages, sendMessage } = require("../controllers/chatController");
const authenticate = require("../middleware/authorization").CheckAuthorization; // JWT middleware

router.get("/users", authenticate, getUsers);
router.get("/:userId", authenticate, getMessages);
router.post("/", authenticate, sendMessage);

module.exports = router;

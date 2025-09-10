const router = require("express").Router();
const { getAllUsers } = require("../controllers/userController");
const { CheckAuthorization } = require("../middleware/authorization");



router.get("/", CheckAuthorization, getAllUsers);

module.exports = router;

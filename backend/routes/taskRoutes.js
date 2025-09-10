const router = require("express").Router();
const taskController = require("../controllers/taskController");
const { CheckAuthorization } = require("../middleware/authorization");

router.use(CheckAuthorization);

router.get("/", taskController.getTasks);
router.get("/sprint/:sprintId", taskController.getTasksBySprint);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;

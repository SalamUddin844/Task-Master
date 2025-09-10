const router = require("express").Router();
const sprintController = require("../controllers/sprintController");
const { CheckAuthorization } = require("../middleware/authorization");

router.use(CheckAuthorization);

router.get("/", sprintController.getSprints);
router.get("/project/:projectId", sprintController.getSprintsByProject);
router.post("/", sprintController.createSprint);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

module.exports = router;

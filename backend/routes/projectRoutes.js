const router = require("express").Router();
const projectController = require("../controllers/projectController");
const { CheckAuthorization } = require("../middleware/authorization");

router.use(CheckAuthorization);

router.get("/:id", projectController.getProjectById);
router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;

const Router = require("express");
const router = new Router();

const authMiddleWare = require("../middleware/auth.middleware");
const roleCheckerMiddleWare = require("../middleware/roleChecker.middleware");
const ActivitiesController = require("../controller/activities.controller");

router.get("/activities", authMiddleWare, ActivitiesController.getActivities);
router.get("/activities/:id", authMiddleWare, ActivitiesController.getOneActivity);

router.post("/activities", authMiddleWare, ActivitiesController.createActivity);
router.delete("/activities/:id", authMiddleWare, roleCheckerMiddleWare, ActivitiesController.deleteActivity);

module.exports = router
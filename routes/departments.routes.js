const Router = require("express");
const router = new Router();

const authMiddleWare = require("../middleware/auth.middleware");
const roleCheckerMiddleWare = require("../middleware/roleChecker.middleware");
const DepartmentsController = require("../controller/departments.controller");

router.get("/departments", authMiddleWare, DepartmentsController.getDepartments);
router.get("/departments/:id", authMiddleWare, DepartmentsController.getOneDepartment);

router.post("/departments", authMiddleWare, roleCheckerMiddleWare, DepartmentsController.createDepartment);
router.put("/departments/:id", authMiddleWare, roleCheckerMiddleWare, DepartmentsController.changeDepartment);
router.delete("/departments/:id", authMiddleWare, roleCheckerMiddleWare, DepartmentsController.deleteDepartment);

module.exports = router
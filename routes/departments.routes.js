const Router = require("express");
const router = new Router();

const DepartmentsController = require("../controller/departments.controller")

router.post("/departments", DepartmentsController.createDepartment);
router.get("/departments", DepartmentsController.getDepartments);
router.get("/departments/:id", DepartmentsController.getOneDepartment);
router.put("/departments", DepartmentsController.changeDepartment);
router.delete("/departments/:id ", DepartmentsController.deleteDepartment);

module.exports = router
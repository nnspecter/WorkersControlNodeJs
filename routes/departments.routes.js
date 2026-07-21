const Router = require("express");
const router = new Router();

const DepartmentsController = require("../controller/departments.controller")

router.post("/departments", DepartmentsController.createDepartment);

module.exports = router
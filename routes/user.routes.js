const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const roleCheckerMiddleWare = require("../middleware/roleChecker.middleware");
const UsersController = require("../controller/users.controller");

router.post("/users", authMiddleWare, roleCheckerMiddleWare, UsersController.createUser);
router.get("/users", authMiddleWare, roleCheckerMiddleWare, UsersController.getUsers);
router.get("/users/:id", authMiddleWare, roleCheckerMiddleWare, UsersController.getOneUser);
router.put("/users/:id", authMiddleWare, roleCheckerMiddleWare, UsersController.changeUser);
router.delete("/users/:id", authMiddleWare, roleCheckerMiddleWare, UsersController.deleteUser);

module.exports = router
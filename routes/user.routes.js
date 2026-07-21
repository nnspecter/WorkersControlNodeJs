const Router = require("express");
const router = new Router();

const UsersController = require("../controller/users.controller")

router.post("/users", UsersController.createUser);
router.get("/users", UsersController.getUsers);
router.get("/users/:id", UsersController.getOneUser);
router.put("/users", UsersController.changeUser);
router.delete("/users/:id ", UsersController.deleteUser);

module.exports = router
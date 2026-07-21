const Router = require("express");
const router = new Router();

const authMiddleWare = require("../middleware/auth.middleware")
const AuthController = require("../controller/auth.controller")

router.post("/registration", AuthController.startRegistration);
router.post("/login", AuthController.startLogin);
router.post("/check", authMiddleWare, AuthController.check)


module.exports = router
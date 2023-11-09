const router = require("express").Router();

const userController = require("../controllers/user.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

router.get("/", isAuth, isAdmin, userController.getAllUser);
router.get("/role/:role", isAuth, userController.getUserByRole);
router.put("/:userId", isAuth, isAdmin, userController.putChangePwById);
router.delete("/:userId", isAuth, isAdmin, userController.deleteUserById);

module.exports = router;

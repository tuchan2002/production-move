const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const {
  registerVali,
  loginVali,
  changePassVali,
} = require("../validations/auth.validation");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");

router.post(
  "/register",
  isAuth,
  isAdmin,
  registerVali,
  authController.register
);

router.post("/login", loginVali, authController.login);

router.post("/logout", authController.logout);

router.post("/refresh_token", authController.generateAccessToken);

router.post(
  "/change_password",
  isAuth,
  changePassVali,
  authController.changePassword
);

module.exports = router;

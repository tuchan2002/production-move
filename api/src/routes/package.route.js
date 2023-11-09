const router = require("express").Router();

const packageController = require("../controllers/package.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");
const {
  acceptPackage,
  movePackage,
  recallPackage,
} = require("../validations/package.validation");

router.get("/", isAuth, isAdmin, packageController.getAllPackage);

router.get("/own", isAuth, packageController.getPackageWithUnit);

router.get("/:prodLineId", isAuth, isAdmin, packageController.getPackageWithPL);

router.get("/factory/created", isAuth, packageController.getPackageWithFactory);

router.get("/own/:prodLineId", isAuth, packageController.getPackageWithPLUnit);

router.delete("/:packageId", isAuth, packageController.deletePackageWithId);

router.post(
  "/accept",
  isAuth,
  acceptPackage,
  packageController.acceptRecievedPackage
);

router.post("/move", isAuth, movePackage, packageController.movePackage);

router.post(
  "/recall",
  isAuth,
  recallPackage,
  packageController.postProductRecall
);

module.exports = router;

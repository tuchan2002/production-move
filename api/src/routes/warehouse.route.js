const router = require("express").Router();

const warehouseController = require("../controllers/warehouse.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");
const warehouseValidation = require("../validations/warehouse.validation");

router.get("/", isAuth, isAdmin, warehouseController.getAllWH);

router.get("/own", isAuth, warehouseController.getAllOwnWH);

router.get("/:warehouseId", isAuth, warehouseController.getWHwithId);

router.get("/unit/:unitId", isAuth, warehouseController.getAllWHwithUnitId);

router.post(
  "/",
  isAuth,
  warehouseValidation.postWarehouse,
  warehouseController.postWH
);

router.put("/:warehouseId", isAuth, warehouseController.editWH);

router.delete("/:warehouseId", isAuth, warehouseController.deleteWH);

module.exports = router;

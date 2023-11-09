const router = require("express").Router();

const TransportController = require("../controllers/transport.controller");
const isAuth = require("../middlewares/isAuth");

router.get("/product/own/send", isAuth, TransportController.getSendProdTran);

router.get(
  "/product/own/receive",
  isAuth,
  TransportController.getRecieveProdTran
);

router.get("/package/own/send", isAuth, TransportController.getSendPackageTran);

router.get(
  "/package/own/receive",
  isAuth,
  TransportController.getRecievePackageTran
);

module.exports = router;

const productController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const {
  postProductVali,
  postGuarenteesVali,
  postSoldProductVali,
  fixedProductVali,
  moveProductVali,
  acceptProductVali,
} = require("../validations/product.validation");

const router = require("express").Router();

router.post("/", isAuth, postProductVali, productController.postProducts);

router.post(
  "/sell",
  isAuth,
  postSoldProductVali,
  productController.postSoldProduct
);

router.post(
  "/guarentee",
  isAuth,
  postGuarenteesVali,
  productController.postGuarentee
);

router.post("/move", isAuth, moveProductVali, productController.moveProduct);

router.post(
  "/accept",
  isAuth,
  acceptProductVali,
  productController.acceptReceiveProduct
);

router.get(
  "/productline/:prodLineId",
  isAuth,
  productController.getProductByPl
);

router.get("/sold/own", isAuth, productController.getSoldProductOwn);

router.post(
  "/guarentee/fixed",
  isAuth,
  fixedProductVali,
  productController.postProductFixed
);

router.get("/errors/:prodId", isAuth, productController.getErrorProduct);

module.exports = router;

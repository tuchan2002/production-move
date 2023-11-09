const router = require("express").Router();

const RequestController = require("../controllers/request.controller");
const isAuth = require("../middlewares/isAuth");
const {
  createRequest,
  acceptRequest,
} = require("../validations/request.validation");

router.post("/", isAuth, createRequest, RequestController.createRequest);

router.post("/accept", isAuth, acceptRequest, RequestController.acceptRequest);

router.get("/send", isAuth, RequestController.getSendRequestOwn);

router.get("/receive", isAuth, RequestController.getReceiveRequestOwn);

module.exports = router;

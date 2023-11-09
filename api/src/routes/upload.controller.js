const router = require("express").Router();

const uploadController = require("../controllers/upload.controller");

router.post("/upload", uploadController.uploadImages);

router.post("/destroy", uploadController.destroyImages);

module.exports = router;

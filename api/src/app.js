const path = require("path");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const helmet = require("helmet");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const db = require("./models/index.model");
const appRoute = require("./routes/router");
const logEvents = require("./helpers/logEvent");

const port = process.env.PORT || 8000;
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "res/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(morgan("common"));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/res/images", express.static(path.join(__dirname, "res", "images")));

app.use("/api/v1", appRoute);
app.get("*", (req, res, next) => {
  res.status(201).json({
    message: "hello",
  });
});

app.use((error, req, res, next) => {
  logEvents(`${req.method}-----${req.url}-----${error.message}`);
  const status = error.statusCode || 500;
  const message = error.message;
  let errorList;
  if (error.data) {
    errorList = error.data;
  } else {
    errorList = [{ msg: error.message }];
  }
  console.log(error);
  res.status(status).json({ message, success: false, errorList });
});

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Page not found 404!!!",
  });
});

app.listen(port, () => {
  console.log(`Sever is listenning on port: ${port}`);
});

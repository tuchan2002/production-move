const express = require("express");
const productLineRoute = require("./prorductLine.route");
const productRoute = require("./product.route");
const warehouseRoute = require("./warehouse.route");
const packageRoute = require("./package.route");
const authRoute = require("./auth.router");
const userRoute = require("./user.route");
const requestRoute = require("./request.route");
const transportRoute = require("./transport.route");
const statisticRoute = require("./statistic.route");
const uploadRoute = require("./upload.controller");

const appRoute = express();

appRoute.use("/auth", authRoute);

appRoute.use("/users", userRoute);

appRoute.use("/productlines", productLineRoute);

appRoute.use("/products", productRoute);

appRoute.use("/packages", packageRoute);

appRoute.use("/warehouses", warehouseRoute);

appRoute.use("/requests", requestRoute);

appRoute.use("/transports", transportRoute);

appRoute.use("/statistics", statisticRoute);

appRoute.use("/image", uploadRoute);

module.exports = appRoute;

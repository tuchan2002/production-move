const db = require("../models/index.model");
const sequelize = require("sequelize");
const { validationResult } = require("express-validator/check");

const productLineController = {
  getProdLine: async (req, res, next) => {
    const prodLineId = req.params.prodLineId;
    try {
      const productLine = await db.ProductLine.findByPk(prodLineId);
      if (!productLine) {
        const err = new Error("Could not find product line.");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        success: true,
        message: "Get productline successfully.",
        data: { productLine },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  postProdLine: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const productLine = {
      user_id: req.userId,
      ...req.body,
    };

    try {
      const productLineSaved = await db.ProductLine.create(productLine);
      res.status(200).json({
        success: true,
        message: "Create new productLine successfully.",
        data: {
          newProductLine: productLineSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getAllProdLine: async (req, res, next) => {
    try {
      const productLines = await db.ProductLine.findAll();

      res.status(200).json({
        message: "get all productLine successfully.",
        success: true,
        data: { productLines },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getProductLineOwn: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const packages = await db.Package.findAll({
        where: {
          unit_manage_id: unitId,
        },
        attributes: [
          // "product_line_id",
          [sequelize.fn("SUM", sequelize.col("quantity_in_stock")), "amount"],
        ],
        group: ["product_line_id"],
        include: {
          model: db.ProductLine,
          as: "productLine_package",
        },
      });

      const result = packages.map((val) => {
        return {
          productLine: val.dataValues.productLine_package,
          amount: +val.dataValues.amount,
        };
      });

      res.status(200).json({
        success: true,
        message: "Get all productline with unit successfully",
        data: {
          productLines: result,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getProductLineOwnWh: async (req, res, next) => {
    const unitId = req.userId;
    const warehouseId = req.params.warehouseId;

    try {
      const productLines = await db.Package.findAll({
        where: {
          unit_manage_id: unitId,
          warehouse_id: warehouseId,
        },
        attributes: [
          "product_line_id",
          [sequelize.fn("sum", sequelize.col("quantity_in_stock")), "amount"],
        ],
        group: ["product_line_id"],
        include: {
          model: db.ProductLine,
          as: "productLine_package",
        },
      });

      const result = productLines.map((val) => {
        return {
          productLine: val.dataValues.productLine_package,
          amount: +val.dataValues.amount,
        };
      });

      res.status(200).json({
        success: true,
        message: "edit productLine successfully",
        result: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  putEditProdLine: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const prodLineId = req.params.prodLineId;
    const updateData = req.body;

    try {
      const productLine = await db.ProductLine.findByPk(prodLineId);
      if (!productLine) {
        const err = new Error("Could not find product line.");
        err.statusCode = 404;
        throw err;
      }

      const result = await db.ProductLine.update(updateData, {
        where: {
          id: prodLineId,
        },
      });
      res.status(200).json({
        success: true,
        message: "edit productLine successfully",
        result: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  deleteProdLine: async (req, res, next) => {
    const prodLineId = req.params.prodLineId;
    try {
      const productLine = await db.ProductLine.findByPk(prodLineId);

      if (!productLine) {
        const err = new Error("Could not find productline.");
        err.statusCode = 404;
        throw err;
      }

      const result = await db.ProductLine.destroy({
        where: {
          id: prodLineId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Delete productline successfully",
        result: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = productLineController;

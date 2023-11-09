const db = require("../models/index.model");
const { validationResult } = require("express-validator/check");

const warehouseController = {
  getAllWH: async (req, res, next) => {
    try {
      const warehouses = await db.Warehouse.findAll();

      res.status(200).json({
        message: "get all warehouse successfully.",
        success: true,
        result: warehouses,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getWHwithId: async (req, res, next) => {
    const warehouseId = req.params.warehouseId;
    try {
      const warehouse = await db.Warehouse.findByPk(warehouseId);
      if (!warehouse) {
        const err = new Error("Could not find warehouse with id.");
        err.statusCode = 404;
        throw err;
      }
      if (warehouse.unit_manage_id !== req.userId) {
        const err = new Error("Warehouse is not owned by the unit.");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        success: true,
        message: "Get warehouse by id successfully.",
        result: warehouse,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getAllWHwithUnitId: async (req, res, next) => {
    const unitId = req.params.unitId;
    try {
      const warehouses = await db.Warehouse.findAll({
        where: {
          unit_manage_id: unitId,
        },
      });

      res.status(200).json({
        message: "get all warehouse by unitId successfully",
        success: true,
        data: { warehouses },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getAllOwnWH: async (req, res, next) => {
    console.log(req.userId);
    try {
      const warehouses = await db.Warehouse.findAll({
        where: {
          unit_manage_id: +req.userId,
        },
      });

      res.status(200).json({
        message: "get own warehouse by unitId successfully",
        success: true,
        data: { warehouses },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  postWH: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const warehouse = {
      unit_manage_id: req.userId,
      ...req.body,
    };

    try {
      const warehouseSaved = await db.Warehouse.create(warehouse);
      res.status(200).json({
        success: true,
        message: "Create new warehouse successfully.",
        data: {
          newWarehouse: warehouseSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  editWH: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const warehouseId = req.params.warehouseId;
    const updateData = req.body;

    try {
      const warehouse = await db.ProductLine.findByPk(warehouseId);
      if (!warehouse) {
        const err = new Error("Could not find warehouse.");
        err.statusCode = 404;
        throw err;
      }

      const warehouseSaved = await db.Warehouse.update(updateData, {
        where: {
          id: warehouseId,
        },
      });
      res.status(200).json({
        success: true,
        message: "edit warehouse successfully",
        result: warehouseSaved,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  deleteWH: async (req, res, next) => {
    const warehouseId = req.params.warehouseId;
    try {
      const warehouse = await db.Warehouse.findByPk(warehouseId);

      if (!warehouse) {
        const err = new Error("Could not find restaurant.");
        err.statusCode = 404;
        throw err;
      }

      const oldWH = await db.Warehouse.destroy({
        where: {
          id: warehouseId,
        },
      });

      res.status(200).json({
        success: true,
        message: "delete productLine successfully",
        oldWarehouse: oldWH,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = warehouseController;

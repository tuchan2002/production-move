const { Op } = require("sequelize");
const db = require("../models/index.model");
const generateCode = require("../helpers/generateCode");
const { validationResult } = require("express-validator/check");

const packageController = {
  getAllPackage: async (req, res, next) => {},
  getPackageWithUnit: async (req, res, next) => {
    const unitId = req.userId;
    try {
      const packages = await db.Package.findAll({
        where: {
          unit_manage_id: unitId,
          status_code: {
            [Op.ne]: "STT-SHIP",
          },
        },
        include: [
          {
            model: db.ProductLine,
            as: "productLine_package",
          },
          {
            model: db.Warehouse,
            as: "warehouse_package",
          },
          {
            model: db.User,
            as: "user_package",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.User,
            as: "userCreated_package",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.Error,
            as: "error_package",
          },
        ],
      });

      res.status(201).json({
        message: "Get package by management unit successfully.",
        success: true,
        data: {
          packages,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getPackageWithPL: async (req, res, next) => {
    const productLineId = +req.params.prodLineId;

    try {
      const packages = await db.Package.findAll({
        where: {
          product_line_id: productLineId,
          status_code: {
            [Op.ne]: "STT-SHIP",
          },
        },
        include: [
          {
            model: db.ProductLine,
            as: "productLine_package",
          },
          {
            model: db.Warehouse,
            as: "warehouse_package",
          },
          {
            model: db.User,
            as: "user_package",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.Error,
            as: "error_package",
          },
        ],
      });

      res.status(201).json({
        message: "Get package by productline successfully.",
        success: true,
        data: {
          packages,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getPackageWithPLUnit: async (req, res, next) => {
    const unitId = req.userId;
    const productLineId = +req.params.prodLineId;

    try {
      const packages = await db.Package.findAll({
        where: {
          unit_manage_id: unitId,
          product_line_id: productLineId,
          status_code: {
            [Op.ne]: "STT-SHIP",
          },
        },
        include: [
          {
            model: db.ProductLine,
            as: "productLine_package",
          },
          {
            model: db.Warehouse,
            as: "warehouse_package",
          },
          {
            model: db.User,
            as: "user_package",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.Error,
            as: "error_package",
          },
        ],
      });

      res.status(201).json({
        message: "Get package by management unit, productline successfully.",
        success: true,
        data: {
          packages,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getPackageWithFactory: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const packages = await db.Package.findAll({
        where: {
          unit_created_id: unitId,
        },
        include: [
          {
            model: db.ProductLine,
            as: "productLine_package",
          },
          {
            model: db.Warehouse,
            as: "warehouse_package",
          },
          {
            model: db.Error,
            as: "error_package",
          },
          {
            model: db.User,
            as: "user_package",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      res.status(201).json({
        message: "Get package by factory successfully.",
        success: true,
        data: {
          packages,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  deletePackageWithId: async (req, res, next) => {},
  acceptRecievedPackage: async (req, res, next) => {
    const unitId = req.userId;
    const { transportId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    try {
      const transport = await db.PackageTransport.findByPk(transportId);
      console.log(transport.new_unit_id, unitId);
      if (transport.new_unit_id !== unitId) {
        const err = new Error("Transport is not owned by the unit");
        err.statusCode = 400;
        throw err;
      }

      transport.is_shipping = false;
      await transport.save();

      const package = await db.Package.findByPk(transport.package_id);
      package.unit_manage_id = transport.new_unit_id;
      package.warehouse_id = transport.new_WH_id;
      package.status_code = transport.new_STT_code;

      await package.save();

      res.status(201).json({
        message: "Package received successfully.",
        success: true,
        data: {
          transport,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  movePackage: async (req, res, next) => {
    const { unitId, packageId, warehouseId, statusCode } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }
    try {
      const warehouse = await db.Warehouse.findByPk(warehouseId);
      if (warehouse.unit_manage_id !== +unitId) {
        const err = new Error("Warehouse is not managed by the current unit.");
        err.statusCode = 400;
        throw err;
      }
      const package = await db.Package.findByPk(packageId);
      if (!package) {
        const err = new Error("Could not find package.");
        err.statusCode = 404;
        throw err;
      }
      if (package.unit_manage_id !== +req.userId) {
        const err = new Error("Package is not managed by the current unit.");
        err.statusCode = 404;
        throw err;
      }

      const transport = {
        package_id: package.package_id,
        old_STT_code: package.status_code,
        new_STT_code: statusCode,
        old_unit_id: req.userId,
        new_unit_id: +unitId,
        old_WH_id: package.warehouse_id,
        new_WH_id: +warehouseId,
      };

      package.status_code = "STT-SHIP";
      await package.save();

      const transportSaved = await db.PackageTransport.create(transport);
      res.status(201).json({
        message: "Package is being shipped.",
        success: true,
        data: {
          transportSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  postProductRecall: async (req, res, next) => {
    const { packageId, errorDescription, typeErrorCode } = req.body;

    try {
      const package = await db.Package.findByPk(packageId, {
        include: [
          {
            model: db.ProductLine,
            as: "productLine_package",
          },
          {
            model: db.Warehouse,
            as: "warehouse_package",
          },
          {
            model: db.Error,
            as: "error_package",
          },
          {
            model: db.User,
            as: "user_package",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!package) {
        const err = new Error("Could not find pckage.");
        err.statusCode = 400;
        throw err;
      }
      if (package.error_id) {
        const err = new Error("Package has been withdrawn.");
        err.statusCode = 400;
        throw err;
      }
      const error = {
        error_id: generateCode("ERR"),
        description: errorDescription,
        type_code: typeErrorCode,
      };
      const errorSaved = await db.Error.create(error);
      package.error_id = errorSaved.error_id;
      await package.save();
      package.dataValues.error_package = errorSaved;

      let soldProductOfPks = await db.Product.findAll({
        where: {
          isSold: true,
          package_id: packageId,
        },
        order: [
          [
            { model: db.SoldStatus, as: "soldStatus_product" },
            db.Error,
            "createdAt",
            "desc",
          ],
        ],
        include: [
          {
            model: db.SoldStatus,
            as: "soldStatus_product",
            include: [
              {
                model: db.User,
                as: "store_soldStatus",
                attributes: { exclude: ["password"] },
              },
              {
                model: db.Error,
              },
            ],
          },
        ],
      });

      if (soldProductOfPks.length !== 0) {
        soldProductOfPks = soldProductOfPks.filter((val) => {
          if (val.soldStatus_product.guarantees === 0) {
            return true;
          }
          if (val.soldStatus_product.errors[0].error_soldStt.isDone === true) {
            return true;
          }
          return false;
        });

        const soldStatusIds = soldProductOfPks.map((val) => {
          return {
            soldStatus_id: val.soldStatus_product.id,
            sold_statuses: val.soldStatus_product.sold_statuses,
          };
        });
        let errorSoldStts = [];
        // chua update so lan bao hanh

        soldStatusIds.forEach((val) => {
          errorSoldStts.push({
            errorErrorId: errorSaved.error_id,
            soldStatusId: val.soldStatus_id,
          });
        });

        errorSoldStts = await db.ErrorSoldStatus.bulkCreate(errorSoldStts);
      }

      res.status(201).json({
        message: "Package will be withdrawn.",
        success: true,
        data: {
          package,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = packageController;

const { Op } = require("sequelize");
const generateCode = require("../helpers/generateCode");
const db = require("../models/index.model");
const { validationResult } = require("express-validator/check");

const productController = {
  postProducts: async (req, res, next) => {
    const unitId = req.userId;
    const { productLineId, warehouseId, quantity } = req.body;
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
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }

    const products = [];
    const package = {
      package_id: generateCode("PK"),
      unit_manage_id: unitId,
      product_line_id: productLineId,
      quantity: +quantity,
      quantity_in_stock: +quantity,
      warehouse_id: warehouseId,
      status_code: "STT-01",
      unit_created_id: req.userId,
    };

    db.Package.create(package)
      .then(async (result) => {
        for (let i = 1; i <= quantity; i++) {
          products.push({
            prod_id: generateCode("P"),
            isSold: false,
            sold_status_id: null,
            package_id: result.package_id,
            product_line_id: productLineId,
          });
        }

        try {
          const productsSaved = await db.Product.bulkCreate(products);
          res.status(201).json({
            message: "Create successful products",
            success: true,
            data: {
              productsSaved,
            },
          });
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },

  postSoldProduct: async (req, res, next) => {
    const unitId = req.userId;
    const {
      prodId,
      customerName,
      customerPhone,
      customerAddress,
      customerEmail,
      oldCustomerId,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    try {
      const product = await db.Product.findByPk(prodId, {
        include: {
          model: db.Package,
          as: "package_product",
        },
      });

      if (!product) {
        const err = new Error("Could not find product.");
        err.statusCode = 404;
        throw err;
      }
      if (product.isSold) {
        const err = new Error("The product is already sold.");
        err.statusCode = 400;
        throw err;
      }
      if (product.package_product.unit_manage_id !== unitId) {
        const err = new Error("Product is not managed by the current unit..");
        err.statusCode = 400;
        throw err;
      }

      // update package
      const package = await db.Package.findByPk(product.package_id);
      package.quantity_in_stock -= 1;
      await package.save();
      let customer;

      if (oldCustomerId) {
        try {
          customer = await db.Customer.findByPk(oldCustomerId);
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      } else {
        const customerData = {
          name: customerName,
          address: customerAddress,
          email: customerEmail,
          phone_number: customerPhone,
          store_id: product.package_product.unit_manage_id,
        };
        customer = await db.Customer.create(customerData);
      }

      // create status
      const soldStatus = {
        status_code: "STT-03",
        guarantees: 0,
        unit_manage_id: product.package_product.unit_manage_id,
        customer_id: customer.id,
        warehouse_id: product.package_product.warehouse_id,
        sold_store_id: product.package_product.unit_manage_id,
      };
      const soldStatusSaved = await db.SoldStatus.create(soldStatus);

      product.isSold = true;
      product.sold_status_id = soldStatusSaved.id;

      const productSaved = await product.save();
      res.status(201).json({
        message: "Successful product sales.",
        success: true,
        data: {
          soldStatus: soldStatusSaved,
          customer: customer,
          product: productSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  postGuarentee: async (req, res, next) => {
    const { prodId, errorDescription, typeErrorCode } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    try {
      const product = await db.Product.findByPk(prodId);
      if (!product) {
        const err = new Error("Could not find product.");
        err.statusCode = 404;
        throw err;
      }
      const soldStatus = await db.SoldStatus.findByPk(product.sold_status_id);
      const error = {
        error_id: generateCode("ERR"),
        description: errorDescription,
        type_code: typeErrorCode,
      };
      const errorSaved = await db.Error.create(error);

      const errorSoldStt = {
        errorErrorId: errorSaved.error_id,
        soldStatusId: soldStatus.id,
      };

      await db.ErrorSoldStatus.create(errorSoldStt);

      soldStatus.status_code = "STT-04";
      soldStatus.guarantees = soldStatus.guarantees + 1;
      soldStatus.unit_manage_id = req.userId;

      let soldStatusSaved = await soldStatus.save();
      if (soldStatusSaved) {
        soldStatusSaved = await db.SoldStatus.findByPk(product.sold_status_id, {
          order: [[db.Error, "createdAt", "desc"]],
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
        });
      }

      res.status(201).json({
        message: "Product will be under warranty.",
        success: true,
        data: {
          errorSaved,
          soldStatusSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  moveProduct: async (req, res, next) => {
    const { unitId, prodId, warehouseId, statusCode } = req.body;
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
      const product = await db.Product.findByPk(prodId, {
        include: {
          model: db.SoldStatus,
          as: "soldStatus_product",
          attributes: ["id", "unit_manage_id", "status_code", "warehouse_id"],
        },
      });
      if (!product) {
        const err = new Error("Could not find product.");
        err.statusCode = 404;
        throw err;
      }

      if (product.soldStatus_product.unit_manage_id !== req.userId) {
        const err = new Error("Product is not managed by the current unit.");
        err.statusCode = 404;
        throw err;
      }

      product.soldStatus_product.status_code = "STT-SHIP";

      await product.soldStatus_product.save();

      const transport = {
        product_id: product.prod_id,
        old_STT_code: product.soldStatus_product.status_code,
        new_STT_code: statusCode,
        old_unit_id: req.userId,
        new_unit_id: +unitId,
        old_WH_id: product.soldStatus_product.warehouse_id,
        new_WH_id: +warehouseId,
        soldStatus_id: product.sold_status_id,
      };

      const transportSaved = await db.ProductTransport.create(transport);
      res.status(201).json({
        message: "Product is being shipped.",
        success: true,
        data: {
          product,
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

  acceptReceiveProduct: async (req, res, next) => {
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
      const transport = await db.ProductTransport.findByPk(transportId);
      if (transport.new_unit_id !== unitId) {
        const err = new Error("Transport is not managed by the current unit.");
        err.statusCode = 400;
        throw err;
      }

      transport.is_shipping = false;
      await transport.save();

      const soldStatus = await db.SoldStatus.findByPk(transport.soldStatus_id);
      soldStatus.unit_manage_id = transport.new_unit_id;
      soldStatus.status_code = transport.new_STT_code;
      soldStatus.warehouse_id = transport.new_WH_id;

      await soldStatus.save();

      res.status(201).json({
        message: "Product received successfully.",
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

  getProductByPl: async (req, res, next) => {
    const unitId = req.userId;
    const productLineId = req.params.prodLineId;

    try {
      const packages = await db.Package.findAll({
        where: {
          unit_manage_id: unitId,
          product_line_id: productLineId,
        },
      });

      const packageCodes = [];
      packages.forEach((val) => {
        packageCodes.push(val.package_id);
      });

      const products = await db.Product.findAll({
        where: {
          isSold: false,
          package_id: { [Op.in]: packageCodes },
        },
        include: {
          model: db.Package,
          as: "package_product",
          attributes: ["status_code", "warehouse_id"],
        },
      });
      res.status(200).json({
        success: true,
        message: "edit productLine successfully",
        data: {
          products,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  getSoldProductOwn: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const products = await db.Product.findAll({
        where: {
          isSold: true,
          "$soldStatus_product.unit_manage_id$": unitId,
          "$soldStatus_product.status_code$": {
            [Op.ne]: "STT-SHIP",
          },
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
          {
            model: db.Package,
            as: "package_product",
            include: {
              model: db.User,
              as: "userCreated_package",
              attributes: { exclude: ["password"] },
            },
          },
          {
            model: db.ProductLine,
            as: "productLine_product",
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Get all sold products with unit successfully.",
        data: {
          products,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  postProductFixed: async (req, res, next) => {
    const unitId = req.userId;
    const { prodId, isFixed } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }
    try {
      const product = await db.Product.findByPk(prodId, {
        where: {
          isSold: true,
          "$soldStatus_product.unit_manage_id$": unitId,
        },
        order: [
          [
            { model: db.SoldStatus, as: "soldStatus_product" },
            db.Error,
            "createdAt",
            "desc",
          ],
        ],
        include: {
          model: db.SoldStatus,
          as: "soldStatus_product",
          include: {
            model: db.Error,
          },
        },
      });

      const errorSoldStt = product.soldStatus_product.errors[0].error_soldStt;

      errorSoldStt.isDone = true;
      errorSoldStt.isFixed = isFixed;
      errorSoldStt.center_id = unitId;
      const errorSoldSttSaved = await errorSoldStt.save();

      res.status(200).json({
        success: true,
        message: "Product is under warranty.",
        data: {
          product,
          errorSoldSttSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  getErrorProduct: async (req, res, next) => {
    const prodId = req.params.prodId;

    try {
      const product = await db.Product.findByPk(prodId, {
        where: {
          isSold: true,
        },
        include: {
          model: db.SoldStatus,
          as: "soldStatus_product",
        },
      });

      const errors = await db.ErrorSoldStatus.findAll({
        where: {
          soldStatus_id: product.soldStatus_product.id,
        },
        include: {
          model: db.Error,
          as: "err_errSoldStt",
        },
      });

      res.status(201).json({
        message: "get errors successfully.",
        success: true,
        data: {
          errors,
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

module.exports = productController;

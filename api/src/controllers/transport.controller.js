const db = require("../models/index.model");

const TransportController = {
  getSendProdTran: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const rawTransports = await db.ProductTransport.findAll({
        where: {
          old_unit_id: unitId,
        },
        include: [
          {
            model: db.Product,
            as: "product_pTransport",
            attributes: ["prod_id"],
            include: {
              model: db.ProductLine,
              as: "productLine_product",
            },
          },
          {
            model: db.User,
            as: "oldUnit_pTransport",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.User,
            as: "newUnit_pTransport",
            attributes: { exclude: ["password"] },
          },
          {
            model: db.Warehouse,
            as: "oldWH_pTransport",
          },
          {
            model: db.Warehouse,
            as: "newWH_pTransport",
          },
          {
            model: db.SoldStatus,
            as: "soldStatus_pTransport",
          },
        ],
      });

      const transports = fomatProductTransport(rawTransports);

      res.status(201).json({
        message: "Get send transports by unit successfully.",
        success: true,
        data: {
          transports,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getRecieveProdTran: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const rawTransports = await db.ProductTransport.findAll({
        where: {
          new_unit_id: unitId,
        },
        include: [
          {
            model: db.Product,
            as: "product_pTransport",
            attributes: ["prod_id"],
            include: {
              model: db.ProductLine,
              as: "productLine_product",
            },
          },
          {
            model: db.User,
            as: "oldUnit_pTransport",
          },
          {
            model: db.User,
            as: "newUnit_pTransport",
          },
          {
            model: db.Warehouse,
            as: "oldWH_pTransport",
          },
          {
            model: db.Warehouse,
            as: "newWH_pTransport",
          },
          {
            model: db.SoldStatus,
            as: "soldStatus_pTransport",
          },
        ],
      });
      const transports = fomatProductTransport(rawTransports);

      res.status(201).json({
        message: "Get recieve transports by unit successfully.",
        success: true,
        data: {
          transports,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getSendPackageTran: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const rawTransports = await db.PackageTransport.findAll({
        where: {
          old_unit_id: unitId,
        },
        include: [
          {
            model: db.Package,
            as: "package_pkTransport",
            include: {
              model: db.ProductLine,
              as: "productLine_package",
            },
          },
          {
            model: db.User,
            as: "oldUnit_pkTransport",
          },
          {
            model: db.User,
            as: "newUnit_pkTransport",
          },
          {
            model: db.Warehouse,
            as: "oldWH_pkTransport",
          },
          {
            model: db.Warehouse,
            as: "newWH_pkTransport",
          },
        ],
      });

      const transports = fomatPackageTransport(rawTransports);

      res.status(201).json({
        message: "Get send product transports by unit successfully.",
        success: true,
        data: {
          transports,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getRecievePackageTran: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const rawTransports = await db.PackageTransport.findAll({
        where: {
          new_unit_id: unitId,
        },
        include: [
          {
            model: db.Package,
            as: "package_pkTransport",
            include: {
              model: db.ProductLine,
              as: "productLine_package",
            },
          },
          {
            model: db.User,
            as: "oldUnit_pkTransport",
          },
          {
            model: db.User,
            as: "newUnit_pkTransport",
          },
          {
            model: db.Warehouse,
            as: "oldWH_pkTransport",
          },
          {
            model: db.Warehouse,
            as: "newWH_pkTransport",
          },
        ],
      });

      const transports = fomatPackageTransport(rawTransports);

      res.status(201).json({
        message: "Get reccieve product transports by unit successfully.",
        success: true,
        data: {
          transports,
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

const fomatProductTransport = (rawTransports) => {
  const transports = [];
  console.log(rawTransports);
  rawTransports.forEach((val) => {
    oldUnit = val.dataValues.oldUnit_pTransport.dataValues;
    newUnit = val.dataValues.newUnit_pTransport.dataValues;
    oldWH = val.dataValues.oldWH_pTransport.dataValues;
    newWH = val.dataValues.newWH_pTransport.dataValues;
    soldStatus = val.dataValues.soldStatus_pTransport.dataValues;
    product_transport = val.dataValues.product_pTransport.dataValues;

    const { id, old_STT_code, new_STT_code, is_shipping, createdAt, ...rest } =
      val.dataValues;
    const transport = {
      id,
      old_STT_code,
      new_STT_code,
      is_shipping,
      oldUnit,
      newUnit,
      oldWH,
      newWH,
      soldStatus,
      product_transport,
      createdAt,
    };
    transports.push(transport);
  });
  return transports;
};
const fomatPackageTransport = (rawTransports) => {
  const transports = [];
  rawTransports.forEach((val) => {
    oldUnit = val.dataValues.oldUnit_pkTransport.dataValues;
    newUnit = val.dataValues.newUnit_pkTransport.dataValues;
    oldWH = val.dataValues.oldWH_pkTransport.dataValues;
    newWH = val.dataValues.newWH_pkTransport.dataValues;
    package_transport = val.dataValues.package_pkTransport.dataValues;

    const { id, old_STT_code, new_STT_code, is_shipping, createdAt, ...rest } =
      val.dataValues;
    const transport = {
      id,
      old_STT_code,
      new_STT_code,
      is_shipping,
      oldUnit,
      newUnit,
      oldWH,
      newWH,
      package_transport,
      createdAt,
    };
    transports.push(transport);
  });
  return transports;
};

module.exports = TransportController;

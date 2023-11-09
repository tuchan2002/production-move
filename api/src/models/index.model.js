const dbConfig = require("../configs/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  port: dbConfig.PORT,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected database.");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model")(sequelize, DataTypes);
db.ProductLine = require("./productLine.model")(sequelize, DataTypes);
db.Product = require("./product.model")(sequelize, DataTypes);
db.Error = require("./error.model")(sequelize, DataTypes);
db.Package = require("./package.model")(sequelize, DataTypes);
db.Warehouse = require("./warehouse.model")(sequelize, DataTypes);
db.Customer = require("./customer.model")(sequelize, DataTypes);
db.SoldStatus = require("./soldStatus.model")(sequelize, DataTypes);
db.ProductTransport = require("./productTransport.model")(sequelize, DataTypes);
db.PackageTransport = require("./packageTransport.model")(sequelize, DataTypes);
db.Request = require("./request.model")(sequelize, DataTypes);
db.ErrorSoldStatus = require("./errorSoldStatus.model")(sequelize, DataTypes);

// relation function create
const createOneToManyRelation = function (manyModel, oneModel, foreignKey, as) {
  oneModel.hasMany(manyModel, {
    foreignKey: foreignKey,
    as: as,
  });

  manyModel.belongsTo(oneModel, {
    foreignKey: foreignKey,
    as: as,
  });
};

const createOneToOneRelation = function (model1, model2, foreignKey, as) {
  model1.hasOne(model2, {
    foreignKey: foreignKey,
    as: as,
  });

  model2.belongsTo(model1, {
    foreignKey: foreignKey,
    as: as,
  });
};

const createManyToManyRelation = function (model1, model2, modelRelation) {
  model1.belongsToMany(model2, { through: modelRelation });

  model2.belongsToMany(model1, { through: modelRelation });
};

// user relation
createOneToManyRelation(db.ProductLine, db.User, "user_id", "user_productLine");
createOneToManyRelation(db.Package, db.User, "unit_manage_id", "user_package");
createOneToManyRelation(
  db.Package,
  db.User,
  "unit_created_id",
  "userCreated_package"
);
createOneToManyRelation(
  db.Package,
  db.Warehouse,
  "warehouse_id",
  "warehouse_package"
);
createOneToManyRelation(
  db.Warehouse,
  db.User,
  "unit_manage_id",
  "user_warehouse"
);
createOneToManyRelation(db.Customer, db.User, "store_id", "user_customer");
createOneToManyRelation(
  db.SoldStatus,
  db.User,
  "unit_manage_id",
  "user_soldStatus"
);
createOneToManyRelation(
  db.SoldStatus,
  db.User,
  "sold_store_id",
  "store_soldStatus"
);
createOneToManyRelation(
  db.SoldStatus,
  db.Customer,
  "customer_id",
  "customer_soldStatus"
);
// product line relation
createOneToManyRelation(
  db.Product,
  db.ProductLine,
  "product_line_id",
  "productLine_product"
);

createOneToManyRelation(
  db.SoldStatus,
  db.Warehouse,
  "warehouse_id",
  "warehouse_soldStatus"
);

createOneToManyRelation(
  db.Product,
  db.SoldStatus,
  "sold_status_id",
  "soldStatus_product"
);
createOneToManyRelation(
  db.Product,
  db.Package,
  "package_id",
  "package_product"
);
createOneToManyRelation(
  db.Package,
  db.ProductLine,
  "product_line_id",
  "productLine_package"
);
createOneToManyRelation(db.Package, db.Error, "error_id", "error_package");

createManyToManyRelation(db.Error, db.SoldStatus, db.ErrorSoldStatus);

// Package transport relation
createOneToManyRelation(
  db.PackageTransport,
  db.Package,
  "package_id",
  "package_pkTransport"
);
createOneToManyRelation(
  db.PackageTransport,
  db.User,
  "old_unit_id",
  "oldUnit_pkTransport"
);
createOneToManyRelation(
  db.PackageTransport,
  db.User,
  "new_unit_id",
  "newUnit_pkTransport"
);
createOneToManyRelation(
  db.PackageTransport,
  db.Warehouse,
  "old_WH_id",
  "oldWH_pkTransport"
);
createOneToManyRelation(
  db.PackageTransport,
  db.Warehouse,
  "new_WH_id",
  "newWH_pkTransport"
);

// Product transport relation
createOneToManyRelation(
  db.ProductTransport,
  db.Product,
  "product_id",
  "product_pTransport"
);
createOneToManyRelation(
  db.ProductTransport,
  db.User,
  "old_unit_id",
  "oldUnit_pTransport"
);
createOneToManyRelation(
  db.ProductTransport,
  db.User,
  "new_unit_id",
  "newUnit_pTransport"
);
createOneToManyRelation(
  db.ProductTransport,
  db.Warehouse,
  "old_WH_id",
  "oldWH_pTransport"
);
createOneToManyRelation(
  db.ProductTransport,
  db.Warehouse,
  "new_WH_id",
  "newWH_pTransport"
);
createOneToManyRelation(
  db.ProductTransport,
  db.SoldStatus,
  "soldStatus_id",
  "soldStatus_pTransport"
);

createOneToManyRelation(
  db.ErrorSoldStatus,
  db.User,
  "center_id",
  "center_errorSoldStt"
);

// package request model relation
createOneToManyRelation(db.Request, db.User, "sender_id", "sender_request");
createOneToManyRelation(db.Request, db.User, "receiver_id", "receiver_request");

db.sequelize.sync({ alter: true }).then(() => {
  console.log("yes re-sync done!");
});

module.exports = db;

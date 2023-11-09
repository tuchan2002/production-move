module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define("package", {
    package_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  return Package;
};

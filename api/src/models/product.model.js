module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    prod_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    isSold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  return Product;
};

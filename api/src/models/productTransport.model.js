module.exports = (sequelize, DataTypes) => {
  const ProductTransport = sequelize.define("product_transport", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    old_STT_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_shipping: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    new_STT_code: {
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

  return ProductTransport;
};

module.exports = (sequelize, DataTypes) => {
  const PackageTransport = sequelize.define("package_transport", {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    is_shipping: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    old_STT_code: {
      type: DataTypes.STRING,
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

  return PackageTransport;
};

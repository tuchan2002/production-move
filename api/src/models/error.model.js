module.exports = (sequelize, DataTypes) => {
  const Error = sequelize.define("error", {
    error_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_code: {
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

  return Error;
};

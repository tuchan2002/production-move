module.exports = (sequelize, DataTypes) => {
  const ErrorSoldStatus = sequelize.define("error_soldStt", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isFixed: {
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

  return ErrorSoldStatus;
};

module.exports = (sequelize, DataTypes) => {
  const SoldStatus = sequelize.define("sold_status", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    status_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guarantees: {
      type: DataTypes.INTEGER,
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

  return SoldStatus;
};

const { clearCache } = require("../helper/redis");

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    "tblpromopro",
    {
      promoid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      proid: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      prodiscount: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      prodisprice: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      probanner: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      pronew: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
      },

      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },
    },

    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "tblpromopro",
    }
  );

  return Products;
};

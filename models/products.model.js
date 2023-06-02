const { clearCache } = require("../helper/redis");

module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    "tblproduct",
    {
      PROID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      PRODESC: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      ingredients: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      PROQTY: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      ORIGINALPRICE: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },

      PROPRICE: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },

      CATEGID: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      IMAGES: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      PROSTATS: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      OWNERNAME: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      OWNERPHONE: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },

    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "tblproduct",
    }
  );

  return Products;
};

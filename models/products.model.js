module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    "tblproduct",
    {
      proid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      prodesc: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      ingredients: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      proqty: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      originalprice: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      proprice: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      categid: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      images: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      prostats: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      ownername: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      ownerphone: {
        type: DataTypes.STRING(255),
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
      tableName: "tblproduct",
    }
  );

  return Products;
};

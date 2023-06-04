module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    "tblorder",
    {
      orderid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      proid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      orderedqty: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      orderedprice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      orderednum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "tblorder",
    }
  );

  return Orders;
};

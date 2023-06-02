module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    "tblorder",
    {
      ORDERID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      order_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      sub_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      shipping_fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      delivery_date: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      delivery_time: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      payment_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      order_status_id: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
      },

      // charge_fee: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },

      created_at: {
        type: "TIMESTAMP",
        allowNull: true,
      },

      updated_at: {
        type: "TIMESTAMP",
        allowNull: true,
      },
    },

    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "tblorder",
    }
  );

  return Orders;
};

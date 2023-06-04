module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    "tblsummary",
    {
      summaryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      ordereddate: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      customerid: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      orderednum: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      delfee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      payment: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      orderedstats: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      delfee: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      payment: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      paymentmethod: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      orderedstats: {
        type: DataTypes.STRING(255),
        defaultValue: 1,
      },

      orderedremarks: {
        type: DataTypes.STRING(255),
        defaultValue: 1,
      },

      claimedadte: {
        type: DataTypes.STRING(255),
        defaultValue: 1,
      },

      hview: {
        type: DataTypes.STRING(255),
        defaultValue: 1,
      },

      userid: {
        type: DataTypes.STRING(255),
        defaultValue: 1,
      },

      // charge_fee: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },

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
      tableName: "tblsummary",
    }
  );

  return Orders;
};

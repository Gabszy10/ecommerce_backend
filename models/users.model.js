module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "tblcustomer",
    {
      CUSTOMERID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      FNAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      LNAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      MNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      CUSHOMENUM: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      STREETADD: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      BRGYADD: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      CITYADD: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      PROVINCE: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      COUNTRY: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      DBIRTH: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      GENDER: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      PHONE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      EMAILADD: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      ZIPCODE: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      CUSUNAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      CUSPASS: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      CUSPHOTO: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      TERMS: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      DATEJOIN: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },

    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      tableName: "tblcustomer",
    }
  );

  return User;
};

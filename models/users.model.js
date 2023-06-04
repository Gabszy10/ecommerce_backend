module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "tblcustomer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      fname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      lname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      cityadd: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      DBIRTH: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      gender: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      emailadd: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      cusuname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      cuspass: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      datejoin: {
        type: DataTypes.STRING(100),
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
      freezeTableName: true,
      tableName: "tblcustomer",
    }
  );

  return User;
};

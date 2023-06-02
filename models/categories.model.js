module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "tblcategory",
    {
      CATEGID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      CATEGORIES: {
        type: DataTypes.STRING(30),
      },

      USERID: {
        type: DataTypes.STRING(100),
      },
    },

    {
      timestamps: false,
      freezeTableName: true,
      tableName: "tblcategory",
    }
  );

  return Categories;
};

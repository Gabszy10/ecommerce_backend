// db
const db = require("../../models");
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

module.exports = {
  allActiveCategories: async (req, res) => {
    console.log("orderHistory controller reached");

    try {
      const { orderId } = req.params;

      const categories = await sequelize.query(`SELECT * FROM tblcategory`, {
        type: QueryTypes.SELECT,
      });
      console.log(categories);
      return res.status(200).json({
        categories,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
  getCategory: async (req, res) => {
    console.log("orderHistory controller reached");
    const { id } = req.params;
    try {
      const category = await sequelize.query(
        `SELECT * FROM tblcategory WHERE CATEGID=${id}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      return res.status(200).json({
        category,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
  updateCategory: async (req, res) => {
    console.log("orderHistory controller reached");
    const { id, category } = req.body;
    try {
      await sequelize.query(
        `UPDATE tblcategory SET CATEGORIES = '${category}'  WHERE CATEGID=${id}`,
        {
          type: QueryTypes.UPDATE,
        }
      );
      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
  addCategory: async (req, res) => {
    console.log("orderHistory controller reached");
    const { category } = req.body;
    try {
      const { orderId } = req.params;

      const categories = await sequelize.query(
        `INSERT INTO tblcategory (CATEGORIES) VALUES ('${category}')`,
        {
          type: QueryTypes.INSERT,
        }
      );
      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
};

// db
const db = require("../../models");
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

module.exports = {
  productsByFeatured: async (req, res) => {
    try {
      const products = await sequelize.query(
        "SELECT * FROM `tblpromopro` pr , `tblproduct` p , `tblcategory` c WHERE pr.`PROID`=p.`PROID` AND  p.`CATEGID` = c.`CATEGID`  AND PROQTY>0 ",
        {
          type: QueryTypes.SELECT,
        }
      );

      // console.log(product, "Product")
      return res.status(200).json({
        products,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },
};

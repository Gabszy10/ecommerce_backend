// db
const db = require("../../models");
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const Product = db.tblproduct;
const Promo = db.tblpromopro;

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

  getProduct: async (req, res) => {
    console.log("WUHOO");
    const { id } = req.params;

    try {
      const product = await sequelize.query(
        `SELECT * FROM tblproduct WHERE PROID=${id}`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // console.log(product, "Product")
      return res.status(200).json({
        product,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },

  addProduct: async (req, res) => {
    try {
      const {
        owner,
        owner_phone,
        description,
        category,
        price,
        orig_price,
        quantity,
      } = req.body;
      const { location } = req.file;
      console.log(
        owner,
        owner_phone,
        description,
        category,
        price,
        orig_price,
        quantity
      );
      const newProduct = await Product.create({
        ownername: owner,
        ownerphone: owner_phone,
        images: location,
        prodesc: description,
        categid: category,
        proqty: quantity,
        originalprice: orig_price,
        proprice: price,
        prostats: "Available",
      });

      const newPromo = await Promo.create({
        prodisprice: price,
        proid: newProduct.proid,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        owner,
        owner_phone,
        description,
        category,
        price,
        orig_price,
        quantity,
        id,
      } = req.body;

      const product = await sequelize.query(
        `UPDATE tblproduct SET PRODESC = '${description}', PROQTY = '${quantity}', OWNERNAME = '${owner}', OWNERPHONE = '${owner_phone}', CATEGID = '${category}', PROPRICE = '${price}', ORIGINALPRICE = '${orig_price}' WHERE PROID='${id}'`,
        {
          type: QueryTypes.UPDATE,
        }
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },

  adminProduct: async (req, res) => {
    try {
      const products = await sequelize.query(
        "SELECT * FROM `tblpromopro` pr , `tblproduct` p , `tblcategory` c WHERE pr.`PROID`=p.`PROID` AND  p.`CATEGID` = c.`CATEGID` ",
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

  productByRecommended: async (req, res) => {
    try {
      const products = await sequelize.query(
        "SELECT * FROM `tblpromopro` pr , `tblproduct` p , `tblcategory` c WHERE pr.`PROID`=p.`PROID` AND  p.`CATEGID` = c.`CATEGID`  AND PROQTY>0",
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

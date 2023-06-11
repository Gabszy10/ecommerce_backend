const multer = require("multer");
const randomString = require("crypto-random-string");
const fs = require("@cyclic.sh/s3fs")(process.env.CYCLIC_BUCKET_NAME);

// db
const db = require("../../models");
const Product_image = db.product_images;

// const storage = multer.diskStorage({
//   // where images will be stored
//   destination: (req, file, cb) => {
//     cb(null, "assets/products");
//   },

//   // image filename
//   filename: (req, file, cb) => {
//     // 43214321432fdsa.png or 344321hfgk.jpg
//     const fileName = `${new Date().getTime()}-${randomString({
//       length: 10,
//       type: "url-safe",
//     })}.${file.mimetype.replace("image/", "")}`;

//     cb(null, fileName);
//   },
// });

// const upload = multer({
//   storage,

//   // 5 mb max
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },

//   // accepts jpg || png
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
//       return cb(null, true);

//     // else
//     cb(new Error("Only accepts .jpg or .png"), false);
//   },
// });

module.exports = {
  // uploadImageMiddleware: upload.array("image", 10),

  uploadImageMiddleware: async (req, res, next) => {
    try {
      fs.writeFileSync("my_file.txt", new Date().toISOString());
      return res.send("Hello World!");
    } catch (error) {
      console.log(error);
    }
  },

  checkProductImageMiddleware: async (req, res, next) => {
    try {
      const { productImageId } = req.params;

      const { productId } = req.params;

      let productImage = null;

      // check if product image exists by product_image id
      if (productImageId) {
        productImage = await Product_image.findOne({
          where: {
            id: productImageId,
          },
        });

        if (productImage === null) throw "product image not found";
      } else {
        // check if product image exists by product id
        productImage = await Product_image.findOne({
          where: {
            product_id: productId,
          },
        });
      }

      req.productImage = productImage;

      next();
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  getAllProductImageNamesMiddleware: async (req, res, next) => {
    try {
      const { productId } = req.params;

      const productImages = await Product_image.findAll({
        where: {
          product_id: productId,
        },
      });

      req.productImages = productImages;

      next();
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  deleteProductImageFromAssetsMiddleware: async (req, res, next) => {
    console.log("deleteProductImage middleware reached");

    try {
      const productImage = req.productImage;

      // delete from assets folder
      fs.unlink(`assets/products/${productImage.file_name}`, (err) => {
        if (err) {
          console.log(err);
          throw `${productImage.id} cannot be found or already deleted`;
        }
      });

      req.productImageToBeDeleted = productImage;

      next();
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
};

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const randomString = require("crypto-random-string");
const path = require("path")
const fs = require("fs");

const s3 = new S3Client({
  credentials: {
    accessKeyId: "AKIAU6P4XGJTV75BNGFK", // store it in .env file to keep it safe
    secretAccessKey: "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",
  },
  region: "us-east-1", // this is the region that you select in AWS account
});

// db
const db = require("../../models");
const Product_image = db.product_images;

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "ramdale", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb("Error: File type not allowed!");
  }
}

const upload = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 100, // 2mb file size
  },
});

module.exports = {
  uploadImageMiddleware: upload.single("image"),

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

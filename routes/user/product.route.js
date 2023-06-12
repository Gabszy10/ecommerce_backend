const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  productsByFeatured,
  productByRecommended,
  adminProduct,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/user/product.controller");
const {
  uploadImageMiddleware,
} = require("../../middlewares/admin/product_image.middleware");

// MIDDLEWARES

// ROUTES

router.route("/featured").get(productsByFeatured);
router.route("/recommended").get(productByRecommended);
router.route("/admin").get(adminProduct);
router.route("/").post(uploadImageMiddleware, addProduct);
router.route("/").patch(updateProduct);
router.route("/:id").delete(deleteProduct);
router.route("/get/:id").get(getProduct);
module.exports = router;

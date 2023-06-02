const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  productsByFeatured,
} = require("../../controllers/user/product.controller");

// MIDDLEWARES

// ROUTES

router.route("/featured").get(productsByFeatured); // get all products by category

module.exports = router;

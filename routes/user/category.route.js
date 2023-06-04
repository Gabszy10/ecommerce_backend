const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  allActiveCategories,
  addCategory,
  getCategory,
  updateCategory,
} = require("../../controllers/user/category.controller");

// ROUTES
router.route("/").get(allActiveCategories); // get allActiveCategories
router.route("/:id").get(getCategory); // get allActiveCategories
router.route("/").patch(updateCategory); // get allActiveCategories
router.route("/").post(addCategory); // get allActiveCategories

module.exports = router;

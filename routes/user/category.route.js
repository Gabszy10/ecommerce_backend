const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    allActiveCategories,
} = require("../../controllers/user/category.controller");

// ROUTES
router.route("/").get(allActiveCategories); // get allActiveCategories

module.exports = router;

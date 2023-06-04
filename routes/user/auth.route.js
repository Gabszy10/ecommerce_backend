const express = require("express");
const router = express.Router();

// VALIDATORS
const {
  validate,
  signUpSchema,
  signInSchema,
} = require("../../validators/user/auth.validator");

// MIDDLEWARES
const {
  signUpMiddleware,
  signInMiddleware,
} = require("../../middlewares/user/auth.middleware");

// CONTROLLERS
const {
  signUpController,
  signInController,
} = require("../../controllers/user/auth.controller");

// ROUTES
router.route("/signUp").post(signUpController);

router.route("/signIn").post(signInMiddleware, signInController);

module.exports = router;

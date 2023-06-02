const express = require("express");
const router = express.Router();

// VALIDATORS
const {
    validate,
    signUpSchema,
    signInSchema,
} = require("../../validators/admin/auth.validator");

// MIDDLEWARES
const {
    signUpMiddleware,
    signInMiddleware,
} = require("../../middlewares/admin/auth.middleware");

const { authMiddleware } = require("../../middlewares/admin/auth.middleware");

// CONTROLLERS
const {
    signUpController,
    signInController,
    employeeDetails
} = require("../../controllers/admin/auth.controller");

// ROUTES
router
    .route("/signUp")
    .post(validate(signUpSchema), signUpMiddleware, signUpController);

router
    .route("/signIn")
    .post(validate(signInSchema), signInMiddleware, signInController);

router.route("/details").get(authMiddleware, employeeDetails);

module.exports = router;

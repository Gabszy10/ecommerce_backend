const express = require("express");
const router = express.Router();

// VALIDATORS
const {
    validate,
    changeUserPasswordSchema,
} = require("../../validators/user/user.validator");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/user/auth.middleware");

const {
    changePasswordMiddleware,
} = require("../../middlewares/user/user.middleware");

// CONTROLLERS
const {
    userDetails,
    changePassword,
} = require("../../controllers/user/user.controller");

// ROUTES
router.route("/details").get(authMiddleware, userDetails);

router
    .route("/changepassword")
    .post(
        validate(changeUserPasswordSchema),
        authMiddleware,
        changePasswordMiddleware,
        changePassword
    );

module.exports = router;

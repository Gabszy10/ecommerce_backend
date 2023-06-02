const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
} = require("../../controllers/admin/category.controller");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/admin/auth.middleware");
const {
    checkCategory,
} = require("../../middlewares/admin/category.middleware");

// VALIDATORS
const {
    validate,
    addCategorySchema,
} = require("../../validators/admin/category.validator");

// Get all categories
router.route("/").get(authMiddleware, categories);

// Add category
router
    .route("/")
    .post(authMiddleware, validate(addCategorySchema), addCategory);

// Update category
router
    .route("/:categoryId")
    .patch(
        authMiddleware,
        validate(addCategorySchema),
        checkCategory,
        updateCategory
    );

// Delete category
router
    .route("/:categoryId")
    .delete(authMiddleware, checkCategory, deleteCategory);

// toggle category status
router.route("/status/:categoryId").patch(checkCategory, toggleCategoryStatus);

module.exports = router;

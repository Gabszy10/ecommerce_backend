const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    addProductImages,
    deleteProductImageFromDb,
    setProductImageThumbnail,
} = require("../../controllers/admin/product_image.controller");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/admin/auth.middleware");

const {
    checkProductMiddleware,
} = require("../../middlewares/admin/product.middleware");

const {
    uploadImageMiddleware,
    deleteProductImageFromAssetsMiddleware,
    checkProductImageMiddleware,
} = require("../../middlewares/admin/product_image.middleware");

// ROUTES
router.route("/:productId").post(
    authMiddleware,
    checkProductMiddleware, // check if product exists
    checkProductImageMiddleware, // check if product images already exists
    uploadImageMiddleware, // save to assets
    addProductImages // save to db
); // add product images with fieldname 'image'

router
    .route("/:productImageId")
    .delete(
        authMiddleware,
        checkProductImageMiddleware,
        deleteProductImageFromAssetsMiddleware,
        deleteProductImageFromDb
    ); // delete product image

router
    .route("/setthumbnail/:productImageId")
    .patch(
        authMiddleware,
        checkProductImageMiddleware,
        setProductImageThumbnail
    ); // update product image

module.exports = router;

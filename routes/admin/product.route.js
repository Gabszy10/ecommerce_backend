const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    allProducts,
    addProduct,
    patchProduct,
    product,
    deleteProduct,
    togglePublishedProduct,
} = require("../../controllers/admin/product.controller");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/admin/auth.middleware");
const {
    getAllProductImageNamesMiddleware,
} = require("../../middlewares/admin/product_image.middleware");
const {
    checkProductMiddleware,
} = require("../../middlewares/admin/product.middleware");

// VALIDATORS
const {
    validate,
    addProductSchema,
    patchProductSchema,
} = require("../../validators/admin/product.validator");

// ROUTES

// get SINGLE product by filterKey ,
// ?filterKey=filterValue
router.route("/by").get(authMiddleware, product);

router.route("/").get(authMiddleware, allProducts); // get all products

router.route("/").post(validate(addProductSchema), authMiddleware, addProduct); // add product
// "name": "asdasd",
// "slug": "asdasd",
// "type": "asdsa",
// "description": "asdasd",
// "tags": "asdasd",
// "regular_price": 123,
// "discount_price": 213,
// "categories": [{"id": 777}],
// "sub_categories":[{"id":777}]

router
    .route("/:productId")
    .patch(
        validate(patchProductSchema),
        authMiddleware,
        checkProductMiddleware,
        patchProduct
    ); // update product

// "name": "asdasd",
// "slug": "asdasd",
// "type": "asdsa",
// "description": "asdasd",
// "tags": "asdasd",
// "regular_price": 123,
// "discount_price": 213,
// "categories": [{"id": 777}],
// "sub_categories":[{"id":777}]

router
    .route("/:productId")
    .delete(
        checkProductMiddleware,
        getAllProductImageNamesMiddleware,
        deleteProduct
    );

router
    .route("/published/:productId")
    .patch(authMiddleware, checkProductMiddleware, togglePublishedProduct); //toggle published product

module.exports = router;

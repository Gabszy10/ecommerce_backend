const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    allOrders,
    orderById,
    deleteOrderById,
    updateOrderById,
} = require("../../controllers/admin/order.controller");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/admin/auth.middleware");
const { checkOrder } = require("../../middlewares/admin/order.middleware");

// VALIDATORS
const {
    validateQuery,
    validateBody,
    getAllOrderSchema,
    updateOrderSchema,
} = require("../../validators/admin/order.validator");

// ROUTES

// get all recent orders
// please check getAllOrderSChema for lists of accepted queryKeys
router
    .route("/")
    .get(authMiddleware, validateQuery(getAllOrderSchema), allOrders);

// get order
router.route("/:orderId").get(authMiddleware, checkOrder, orderById);

// delete order
router.route("/:orderId").delete(authMiddleware, checkOrder, deleteOrderById);

// patch order
router
    .route("/:orderId")
    .patch(
        authMiddleware,
        validateBody(updateOrderSchema),
        checkOrder,
        updateOrderById
    );

module.exports = router;

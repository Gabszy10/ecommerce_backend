const express = require("express");
const router = express.Router();

// VALIDATORS
const {
  validate,
  createOrderSchema,
  sendEmailSchema,
} = require("../../validators/user/order.validator");

// MIDDLEWARES
const { authMiddleware } = require("../../middlewares/user/auth.middleware");

// CONTROLLERS
const {
  createOrder,
  orderByName,
  orderHistory,
  sendEmail,
  allOrders,
  confirmOrder,
} = require("../../controllers/user/order.controller");

const {
  updateOrderProductPrices,
} = require("../../middlewares/user/order.middleware");

// ROUTES

router.route("/history/:orderId").get(orderHistory); // get user's order history

router.route("/name/:orderName").get(orderByName); // get order by name

router.route("/").post(createOrder); // createOrder
router.route("/").get(allOrders); // createOrder
router.route("/confirm/:orderid").patch(confirmOrder); // createOrder

//     {
//         "orderItems": [
//             {
//                 "productId": "1",
//                 "quantity": 2,
//                 "itemPrice": 651
//             },
//             {
//                 "productId": "2",
//                 "quantity": 2,
//                 "itemPrice": 751
//             }
//         ],
//         "shippingFirstName": "Iris",
//         "shippingLastName": "Palma",
//         "shippingPhone": "09053173281",
//         "shippingAddress": "B6 L7 Kaunlaran Homes Subd., Buhaynasapa",
//         "shippingCity": "San Juan",
//         "shippingProvince":"Batangas",
//         "shippingZip": "4226",
//         "deliveryInstructions": "Gate Pass needed",
//         "billingFirstName" : "Val",
//         "billingLastName" : "Palma",
//         "billingPhone": "094913512175",
//         "billingEmail": "palma_arcival@yahoo.com",
//         "deliveryDate": "September 2, 2020",
//         "deliveryTime": "Anytime",
//         "paymentMethod" : "COD"
//     }

module.exports = router;

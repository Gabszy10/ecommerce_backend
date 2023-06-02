const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
  allUsers,
  createUser,
  deleteUser,
  attendance,
  allAttendance
} = require("../../controllers/admin/user.controller");

// VALIDATORS
const {
  validateQuery,
  validateBody,
  getAllUserSchema,
  createUserSchema,
} = require("../../validators/admin/user.validator.js");

// ROUTES

// get all recent orders
// please check getAllOrderSChema for lists of accepted queryKeys
router.route("/").get(validateQuery(getAllUserSchema), allUsers);

router.route("/create").post(validateBody(createUserSchema), createUser);

router.route("/:userId").delete(deleteUser);

router.route("/attendance").post(attendance);
router.route("/timesheet").post(allAttendance);

module.exports = router;

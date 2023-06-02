// db
const db = require("../../models");
const Employee = db.employees;
const Attendance = db.attendance;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const bcrypt = require("bcryptjs");

module.exports = {
  allUsers: async (req, res) => {
    const { page, limit } = req.validated.user;

    console.log("allOrders controller reached");

    try {
      // This will get all recent orders with filter
      const orders = await Employee.findAndCountAll({
        where: {
          employee_role_id: {
            [Op.not]: 2,
          },
        },
        order: [["id", "DESC"]],

        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },

        // include tables
        // if limit is null return null
        limit: limit ? parseInt(limit) : null,

        // if page is undefined return null
        offset: page ? (page - 1) * limit : null,
      });

      const totalPages = orders.count / limit;

      console.log(totalPages);

      return res.status(200).json({
        orders,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  createUser: async (req, res) => {
    console.log("signUp controller reached");
    try {
      let { user, name, email, password } = req.validated.user;

      // Create hash
      const newHashPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await Employee.create({
        name,
        username: user,
        email,
        password: newHashPassword,
      });

      // Generate JWT token
      const newToken = token(newUser.id);

      return res.status(200).json({
        token: newToken,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },

  orderById: async (req, res) => {
    console.log("orderById controller reached");

    try {
      const { orderId } = req.params;

      const order = await Order.findOne({
        where: {
          id: orderId,
        },

        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },

        // include tables
        include: [
          // order_details
          {
            model: db.order_details,
            attributes: {
              exclude: ["createdAt", "updatedAt", "created_at", "updated_at"],
            },
          },

          {
            model: db.order_items,
            attributes: ["quantity", "item_price", "total"],

            include: [
              {
                model: db.products,
                attributes: ["name"],
              },
            ],
          },

          // order_status
          {
            model: db.order_status,
            attributes: {
              exclude: ["createdAt", "updatedAt", "created_at", "updated_at"],
            },
          },

          // payment_status
          {
            model: db.payment_status,
            attributes: {
              exclude: ["createdAt", "updatedAt", "created_at", "updated_at"],
            },
          },
        ],
      });

      return res.status(200).json({
        order,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  deleteUser: async (req, res) => {
    console.log("deleteSub_category controller reached");

    try {
      const { userId } = req.params;

      const employee = await Employee.findOne({
        where: {
          id: userId,
        },
      });

      if (employee === null) throw "sub_category not found";

      await employee.destroy();

      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  attendance: async (req, res) => {
    console.log("attendance controller reached");

    try {
      const { userId, timeIn, timeOut, timeDate } = req.body;

      const employee = await Employee.findOne({
        where: {
          id: userId,
        },
      });

      if (employee === null) throw "employee not found";

      const attendance = await Attendance.findOne({
        where: {
          employee_id: userId,
          time_date: timeDate,
        },
      });

      if (attendance) {
        attendance.time_out = timeOut;
        await attendance.save();
      } else {
        // Create new user
        const newAttendance = await Attendance.create({
          employee_id: userId,
          time_in: timeIn,
          time_out: timeOut,
          time_date: timeDate,
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  allAttendance: async (req, res) => {
    console.log("attendance controller reached");

    const { timeDate } = req.body;
    let rows = [];
    try {
      const employees = await Employee.findAll();

      if (employees === null) throw "employees not found";

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];

        let employeeAttendance = await Attendance.findOne({
          where: {
            employee_id: employee.id,
            time_date: timeDate,
          },
        });

        let row = {
          id: employee.id,
          username: employee.username,
          email: employee.email,
          name: employee.name,
        };

        if (employeeAttendance) {
          row = {
            ...row,
            time_in: employeeAttendance.time_in,
            time_out: employeeAttendance.time_out,
            time_date: timeDate,
          };
          rows.push(row);
        } else {
          row = {
            ...row,
            time_in: null,
            time_out: null,
            time_date: timeDate,
          };
          rows.push(row);
        }
      }

      return res.status(200).json({
        rows: rows,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  //   deleteOrderById: async (req, res) => {
  //     console.log("deleteOrderById controller reached");

  //     try {
  //       const order = req.order;

  //       const { orderId } = req.params;

  //       await Promise.all([
  //         // delete Order details
  //         Order_detail.destroy({
  //           where: {
  //             order_id: orderId,
  //           },
  //         }),

  //         // delete order items
  //         Order_item.destroy({
  //           where: {
  //             order_id: orderId,
  //           },
  //         }),

  //         order.destroy(),
  //       ]);

  //       return res.status(200).json({
  //         success: true,
  //       });
  //     } catch (err) {
  //       console.log(err);

  //       return res.status(400).json({
  //         err,
  //       });
  //     }
  //   },

  //   updateOrderById: async (req, res) => {
  //     console.log("updateOrderById controller reached");

  //     try {
  //       const order = req.order;

  //       const {
  //         delivery_date,
  //         delivery_time,
  //         payment_status_id,
  //         payment_method,
  //         order_status_id,
  //       } = req.validated.order;

  //       order.delivery_date = delivery_date;
  //       order.delivery_time = delivery_time;
  //       order.payment_status_id = payment_status_id;
  //       order.payment_method = payment_method;
  //       order.order_status_id = order_status_id;

  //       await order.save();

  //       return res.status(200).json({
  //         success: true,
  //       });
  //     } catch (err) {
  //       console.log(err);

  //       return res.status(400).json({
  //         err,
  //       });
  //     }
  //   },
};

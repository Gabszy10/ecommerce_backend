// db
const db = require("../../models");
const Order = db.orders;
const Order_detail = db.order_details;
const Order_item = db.order_items;
const sequelize = require("sequelize");
const Product = db.products;
const Op = sequelize.Op;

module.exports = {
  allOrders: async (req, res) => {
    console.log("allOrders controller reached");

    try {
      const {
        page,
        limit,
        order_name,
        payment_method,
        created_at,
        delivery_time,
        delivery_date,
        order_status_id,
        payment_status_id,
      } = req.validated.order;

      let orderFilter = {};

      if (order_name)
        orderFilter["order_name"] = {
          [Op.like]: "%" + order_name + "%",
        };
      if (payment_method) orderFilter["payment_method"] = payment_method;
      if (created_at) orderFilter["created_at"] = created_at;
      if (delivery_date)
        orderFilter["created_at"] = {
          [Op.like]: "%" + delivery_date + "%",
        };
      // if (delivery_time) orderFilter["delivery_time"] = delivery_time;
      // if (delivery_date) orderFilter["created_at"] = delivery_date;
      if (order_status_id) orderFilter["order_status_id"] = order_status_id;
      if (payment_status_id)
        orderFilter["payment_status_id"] = payment_status_id;

      // This will get all recent orders with filter
      const orders = await Order.findAndCountAll({
        where: orderFilter,

        order: [["id", "DESC"]],

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

  deleteOrderById: async (req, res) => {
    console.log("deleteOrderById controller reached");

    try {
      const order = req.order;

      const { orderId } = req.params;

      await Promise.all([
        // delete Order details
        Order_detail.destroy({
          where: {
            order_id: orderId,
          },
        }),

        // delete order items
        Order_item.destroy({
          where: {
            order_id: orderId,
          },
        }),

        order.destroy(),
      ]);

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

  updateOrderById: async (req, res) => {
    console.log("updateOrderById controller reached");

    try {
      const order = req.order;

      const {
        delivery_date,
        delivery_time,
        payment_status_id,
        payment_method,
        order_status_id,
      } = req.validated.order;

      order.delivery_date = delivery_date;
      order.delivery_time = delivery_time;
      order.payment_status_id = payment_status_id;
      order.payment_method = payment_method;
      order.order_status_id = order_status_id;

      await order.save();

      if (order_status_id == 7) {
        const orderItem = await Order_item.findAll({
          where: {
            order_id: order.id,
          },
        });

        for (let i = 0; i < orderItem.length; i++) {
          const el = orderItem[i];
          const product = await Product.findOne({
            where: {
              id: el.product_id,
            },
          });

          if (product.stock > 0) {
            product.stock = product.stock - el.quantity;

            await product.save(); 
          }
        }
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
};

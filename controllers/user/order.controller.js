// db
const db = require("../../models");
const nodemailer = require("nodemailer");
const { orderItemText, paymentText } = require("../../helper/confirm_email");
const Order = db.tblorder;
const Summary = db.tblsummary;
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");

module.exports = {
  createOrder: async (req, res) => {
    console.log("createOrder controller reached");

    try {
      const { user, cart, total } = req.body;
      let latestOrder = await Order.findOne({
        order: [["ORDEREDNUM", "DESC"]],
      });
      let id = latestOrder.orderednum + 1;
      // create new order
      for (let i = 0; i < cart.length; i++) {
        const el = cart[i];

        const newOrder = await Order.create({
          orderednum: id,
          userid: user.id,
          orderedprice: el.PROPRICE,
          orderedqty: el.quantity,
          proid: el.PROID,
        });
      }

      const newSummary = await Summary.create({
        ordereddate:
          new Date().toISOString().slice(0, 10) +
          " " +
          new Date().toLocaleTimeString("en-GB"),
        customerid: user.id,
        orderednum: id,
        delfee: 0,
        paymentmethod: "Cash on delivery",
        payment: total,
        orderedstats: "Pending",
        claimedadte: "",
        orderedremarks: "Your order is on process.",
        hview: 0,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },

  orderByName: async (req, res, next) => {
    try {
      const { orderName } = req.params;

      const orderByName = await Order.findOne({
        where: {
          order_name: orderName,
        },

        attributes: {
          exclude: ["created_at", "updated_at", "createdAt", "updatedAt"],
        },

        include: [
          {
            model: db.order_status,
          },

          {
            model: db.payment_status,
          },

          {
            model: db.order_details,
            attributes: {
              exclude: ["created_at", "updated_at", "createdAt", "updatedAt"],
            },
          },

          {
            model: db.order_items,
            attributes: ["quantity", "item_price", "total", "product_id"],
            include: [
              {
                model: db.products,
                attributes: ["name"],
                required: false,
                include: [
                  {
                    model: db.product_images,
                    where: {
                      thumbnail: 1,
                    },
                    attributes: ["file_name"],
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (orderByName === null) throw "orderName not found";

      return res.status(200).json({
        orderByName,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  orderHistory: async (req, res) => {
    console.log("orderHistory controller reached");

    try {
      const { orderId } = req.params;

      const orders = await sequelize.query(
        `SELECT * FROM tblsummary  WHERE  CUSTOMERID= ${orderId}  ORDER BY   ORDEREDNUM desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
      console.log(orders);
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

  allOrders: async (req, res) => {
    console.log("orderHistory controller reached");

    try {
      const orders = await sequelize.query(
        `SELECT * FROM tblsummary  ORDER BY   ORDEREDNUM desc`,
        {
          type: QueryTypes.SELECT,
        }
      );
      console.log(orders);
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

  confirmOrder: async (req, res) => {
    console.log("orderHistory controller reached");
    const { orderid } = req.params;
    try {
      const orders = await sequelize.query(
        `UPDATE tblsummary SET ORDEREDREMARKS = "Your order has been confirmed.", ORDEREDSTATS = "Confirmed" WHERE SUMMARYID=${orderid}`,
        {
          type: QueryTypes.UPDATE,
        }
      );
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

  orderDetails: async (req, res) => {
    console.log("orderHistory controller reached");

    try {
      const { orderNum } = req.body;

      const items = await sequelize.query(
        "SELECT * FROM  `tblproduct` p, tblcategory ct,  `tblcustomer` c,  `tblorder` o,  `tblsummary` s WHERE p.`CATEGID` = ct.`CATEGID`  AND p.`PROID` = o.`PROID`  AND o.`ORDEREDNUM` = s.`ORDEREDNUM`  AND s.`CUSTOMERID` = c.`id`  AND o.`ORDEREDNUM`=" +
          orderNum,
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json({
        items,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
};

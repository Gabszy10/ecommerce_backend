// db
const db = require("../../models");
const nodemailer = require("nodemailer");
const { orderItemText, paymentText } = require("../../helper/confirm_email");
const Order = db.orders;
const Province = db.provinces;
const Order_item = db.order_items;
const Order_details = db.order_details;

module.exports = {
  createOrder: async (req, res) => {
    console.log("createOrder controller reached");

    try {
      const {
        orderItems,
        shippingFirstName,
        shippingLastName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingProvince,
        // message,
        deliveryInstructions,
        billingFirstName,
        billingLastName,
        billingPhone,
        billingEmail,
        deliveryDate,
        deliveryTime,
        paymentMethod,
        userId,
      } = req.validated.order;

      const { productsSubTotal } = req.order;

      // get the province shipping fee
      const province = await Province.findOne({
        where: {
          name: shippingProvince,
        },

        include: [
          {
            model: db.shipping_fees,
          },
        ],
      });

      // create new order
      const newOrder = await Order.create({
        sub_total: productsSubTotal,
        // charge_fee: productsSubTotal < 800 ? 800 - productsSubTotal : 0,
        user_id: userId,
        shipping_fee: 0,
        total: productsSubTotal < 100 ? 100 : productsSubTotal,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        payment_method: paymentMethod,
      });

      const newOrderId = newOrder.id;

      // create orderWithOrder Id to be push on order_items
      let itemsWithOrderId = [];

      for (let index = 0; index < orderItems.length; index++) {
        const { productId, itemPrice, quantity } = orderItems[index];

        let orderItem = {
          order_id: newOrderId,
          product_id: productId,
          quantity,
          item_price: itemPrice,
          total: itemPrice * quantity,
        };

        itemsWithOrderId.push(orderItem);
      }

      // create order_name
      const orderName = `FM-${newOrderId * 100}`;

      // await all
      await Promise.all([
        Order.update({ order_name: orderName }, { where: { id: newOrderId } }),

        Order_item.bulkCreate(itemsWithOrderId),

        Order_details.create({
          order_id: newOrderId,
          billing_first_name: billingFirstName,
          billing_last_name: billingLastName,
          billing_email: billingEmail,
          billing_phone: billingPhone,
          shipping_address: shippingAddress,
          shipping_first_name: shippingFirstName,
          shipping_last_name: shippingLastName,
          shipping_phone: shippingPhone,
          shipping_city: shippingCity,
          shipping_province: shippingProvince,
          shipping_zip: shippingZip,
          delivery_instructions: deliveryInstructions,
          // message: message,
        }),
      ]);

      return res.status(200).json({
        success: true,
        order_name: orderName,
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
      const { id } = req.user;

      const orders = await Order.findAll({
        where: {
          user_id: id,
        },

        attributes: {
          exclude: ["createdAt", "updatedAt"],
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

      if (orders.length < 1) throw "user order history not found";

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

  sendEmail: async (req, res) => {
    try {
      const {
        orderName,
        cryptoStr,
        billingEmail,
        billingFirstName,
        orderItems,
        deliveryDate,
        paymentMethod,
      } = req.validated.order;

      let itemText = "";
      let paymentTxt = "";

      itemText = orderItemText(orderItems, itemText);
      paymentTxt = paymentText(paymentMethod, paymentTxt);

      let transporter = nodemailer.createTransport({
        service: "gmail",
        host:
          process.env.EMAIL_ENV === "production"
            ? process.env.EMAIL_SMTP
            : process.env.EMAIL_SMTP,
        port:
          process.env.EMAIL_ENV === "production"
            ? process.env.EMAIL_PORT
            : process.env.EMAIL_PORT,
        auth: {
          user:
            process.env.EMAIL_ENV === "production"
              ? process.env.EMAIL_USER
              : "calvento.calvin@gmail.com",
          pass:
            process.env.EMAIL_ENV === "production"
              ? process.env.EMAIL_PASS
              : "podpeste12345",
        },
      });

      let mailOptions = {
        from: "FlowerNinja <flowerninja24@gmail.com>",
        to:
          process.env.EMAIL_ENV === "production"
            ? billingEmail
            : process.env.EMAIL_TO_DEVELOPMENT,
        subject: `Your order ${orderName} has been confirmed!`,
        text: `
        Hi! ${billingFirstName},

        Greetings!
        
        Your order has been received, and we will notify you by ${deliveryDate} once the order is ready to be picked up. We will send a photo as Proof of Delivery to your email address.

        Order #: ${orderName}
        Order Items(s): ${itemText.replace(/,\s*$/, "")}
        ${paymentTxt}

        Thank you for your purchase, Have a wonderful and flowery day!

        Please see your full order details in this url: http://flowerninja.shop/thankyou/${cryptoStr}
        Like us on Facebook to get 50% DISCOUNT! https://www.facebook.com/flowerninja.shop`,
        replyTo: "flowerninja26@gmail.com",
      };

      res.status(200).json({
        error: false,
      });

      await transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error occurs", err);
        } else {
          console.log(`Email Sent to ${billingEmail}`);
        }
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
};

// db
const db = require("../../models");
const Product = db.products;

module.exports = {
  updateOrderProductPrices: async (req, res, next) => {
    try {
      const { orderItems, isCampaign } = req.validated.order;

      const orderErrors = [];

      const updatedOrderItems = [];

      let productsSubTotal = 0;

      req.order = {};

      // loop orderItems
      for (let index = 0; index < orderItems.length; index++) {
        const { productId, itemPrice, quantity } = orderItems[index];

        // query each item
        const product = await Product.findOne({
          where: {
            id: productId,
          },

          attributes: ["discount_price", "name"],
        });

        // match if price is updated
        if (isCampaign) {
        } else {
          if (product.discount_price !== itemPrice) {
            orderErrors.push(`${product.name}'s price is not updated`);

            // push items that is not updated
            updatedOrderItems.push({
              productId,
              quantity,
              discount_price: product.discount_price,
            });
          }
        }

        const productSubtotal =  product.discount_price * quantity;

        // get the subtotal of all items
        productsSubTotal += productSubtotal;
      }

      // throw errors if theres any with updatedOrderItems
      if (orderErrors.length > 0) {
        return res.status(500).json([{
          message: "Price may have change, Please try again.",
          updatedOrderItems,
        }]);
      }

      req.order.productsSubTotal = productsSubTotal;

      next();
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error,
      });
    }
  },
};

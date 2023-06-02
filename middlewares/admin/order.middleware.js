// db
const db = require("../../models");
const Order = db.orders;

module.exports = {
    checkOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;

            const order = await Order.findOne({
                where: {
                    id: orderId,
                },
            });

            if (order === null) throw "order not found";

            req.order = order;

            next();
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

const db = require("../../models");
const Product = db.products;
const Product_image = db.product_images;
const fs = require("fs");

module.exports = {
    checkProductMiddleware: async (req, res, next) => {
        try {
            const productId = req.params.productId;

            const product = await Product.findOne({
                where: {
                    id: productId,
                },
            });

            if (product === null) throw "Product not found";

            req.product = product;

            next();
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

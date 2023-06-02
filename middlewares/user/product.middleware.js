// db
const db = require("../../models");
const Product = db.products;

module.exports = {
    relatedProduct: (req, res, next) => {
        req.relatedProduct = 4;

        next();
    },
};

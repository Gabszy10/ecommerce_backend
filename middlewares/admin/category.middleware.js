// db
const db = require("../../models");
const Category = db.categories;

module.exports = {
    checkCategory: async (req, res, next) => {
        try {
            const { categoryId } = req.params;

            const category = await Category.findOne({
                where: {
                    id: categoryId,
                },
            });

            if (category === null) throw "category not found";

            req.category = category;

            next();
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

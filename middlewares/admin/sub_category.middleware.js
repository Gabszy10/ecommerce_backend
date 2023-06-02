// db
const db = require("../../models");
const Sub_category = db.sub_categories;

module.exports = {
    checkSub_category: async (req, res, next) => {
        try {
            const { sub_categoryId } = req.params;

            const sub_category = await Sub_category.findOne({
                where: {
                    id: sub_categoryId,
                },
            });

            if (sub_category === null) throw "sub_category not found";

            req.sub_category = sub_category;

            next();
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

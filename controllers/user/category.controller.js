// db
const { modelCached } = require("../../helper/redis");
const db = require("../../models");
const Category = modelCached(db.categories);

module.exports = {
  allActiveCategories: async (req, res) => {
    try {
      // select all products from collection with status 1
      const [categories, cacheHit] = await Category.findAllCached("categories", {
        where: {
          status: 1,
        },

        // exclude
        attributes: {
          exclude: ["created_at", "updated_at", "createdAt", "updatedAt"],
        },

        include: [
          {
            model: db.sub_categories,
          },
        ],
      });
      console.log("Categories Cache", cacheHit);
      return res.status(200).json({
        categories,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },
};

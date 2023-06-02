// db
const db = require("../../models");
const Category = db.categories;

module.exports = {
    categories: async (req, res, next) => {
        console.log("categories controller reached");

        try {
            const categories = await Category.findAll();

            return res.status(200).json({
                categories,
            });
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },

    addCategory: async (req, res, next) => {
        console.log("addCategory controller reached");

        try {
            const { name, slug } = req.validated.category;

            await Category.create({
                name,
                slug,
            });

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

    updateCategory: async (req, res, next) => {
        console.log("updateCategory controller reached");

        try {
            const { name, slug } = req.validated.category;

            const category = req.category;

            category.name = name;

            category.slug = slug;

            await category.save();

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

    deleteCategory: async (req, res, next) => {
        console.log("deleteCategory controller reached");

        try {
            const category = req.category;

            await category.destroy();

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

    toggleCategoryStatus: async (req, res, next) => {
        console.log("toggleCategoryStatus controller reached");

        try {
            const category = req.category;

            category.status = category.status === 1 ? 0 : 1;

            await category.save();

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

// db
const db = require("../../models");
const Product_image = db.product_images;
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = {
    addProductImages: async (req, res) => {
        console.log("addProductImage controller reached");

        try {
            const images = req.files;

            const { productId } = req.params;

            const addProductImages = [];

            for (let index = 0; index < images.length; index++) {
                const { filename } = images[index];

                addProductImages.push(
                    Product_image.create({
                        product_id: productId,
                        file_name: filename,
                        // if productImage is not equal to null means product image already exists
                        // succeeding image must be 0 ||
                        // first index of image will be the default image
                        thumbnail:
                            req.productImage !== null ? 0 : index === 0 ? 1 : 0,
                    })
                );
            }

            await Promise.all(addProductImages);

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

    deleteProductImageFromDb: async (req, res) => {
        console.log("deleteProductImageFromDb controller reached");

        try {
            // delete from db
            await req.productImageToBeDeleted.destroy();

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

    setProductImageThumbnail: async (req, res) => {
        console.log("setProductImageThumbnail controller reached");

        try {
            const productImage = req.productImage;

            // set the product image to thumbnail 1
            productImage.thumbnail = 1;

            await Promise.all([
                productImage.save(),

                // make sure the rest of product images of product are not a thumbnail
                Product_image.update(
                    {
                        thumbnail: 0,
                    },
                    {
                        where: {
                            [Op.and]: {
                                product_id: productImage.product_id,
                                id: {
                                    [Op.not]: productImage.id,
                                },
                            },
                        },
                    }
                ),
            ]);

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

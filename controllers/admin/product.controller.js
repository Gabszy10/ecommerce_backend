// db
const db = require("../../models");
const Product = db.products;
const Product_image = db.product_images;
const Product_review = db.product_reviews;
const Category_product = db.category_products;
const Sub_category_product = db.sub_category_products;
const fs = require("fs");

// Insert into categories and sub_categories loop
const insertCategoriesAndSub_categories = (
  categories,
  sub_categories,
  product_id
) => {
  // beginning array
  const categoriesAndSubCategoriesProducts = [];

  for (let index = 0; index < categories.length; index++) {
    const category_id = categories[index].id;

    categoriesAndSubCategoriesProducts.push(
      Category_product.create({
        category_id,
        product_id: product_id,
      })
    );
  }

  for (let i = 0; i < sub_categories.length; i++) {
    const sub_category_id = sub_categories[i].id;

    categoriesAndSubCategoriesProducts.push(
      Sub_category_product.create({
        sub_category_id,
        product_id: product_id,
      })
    );
  }

  return categoriesAndSubCategoriesProducts;
};

module.exports = {
  product: async (req, res) => {
    console.log("oneProduct controller reached");

    try {
      // get the key of query
      const key = Object.keys(req.query)[0];

      // get value of the key
      const value = req.query[key];

      const product = await Product.findOne({
        // filter
        where: {
          // id: 1,
          // slug:"slugName",
          [key]: value,
        },

        // required ...  this will make sures fetch goes even if include models is null
        include: [
          // include images
          {
            model: db.product_images,
            required: false,
          },

          // include reviews
          {
            model: db.product_reviews,
            required: false,
          },

          // include sub categories
          {
            model: db.sub_categories,
            required: false,
          },

          // include categories
          {
            model: db.categories,
            required: false,
          },
        ],
      });

      return res.status(200).json({
        product,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  allProducts: async (req, res) => {
    console.log("allProducts controller reached");

    try {
      const products = await Product.findAll({
        include: [
          {
            model: db.product_images,
            required: false,
          },
        ],
      });

      return res.status(200).json({
        products,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  addProduct: async (req, res) => {
    console.log("addProduct controller reached");

    try {
      // get all validated body
      const {
        name,
        slug,
        type,
        stock,
        parts,
        description,
        tags,
        regular_price,
        discount_price,
        categories,
        sub_categories,
      } = req.validated.product;

      // Add product
      const addProduct = await Product.create({
        name,
        slug,
        stock,
        parts,
        type,
        description,
        tags,
        regular_price,
        discount_price,
      });

      const categoriesAndSubCategoriesProducts =
        insertCategoriesAndSub_categories(
          categories,
          sub_categories,
          addProduct.id
        );

      // Insert pivot tables
      await Promise.all(categoriesAndSubCategoriesProducts);

      return res.status(200).json({
        sucess: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  patchProduct: async (req, res) => {
    console.log("patchProduct controller reached");

    try {
      const product_id = req.params.productId;

      // get all validated body
      const {
        name,
        slug,
        type,
        description,
        tags,
        stock,
        parts,
        regular_price,
        discount_price,

        // this is for pivot tables
        categories,
        sub_categories,
      } = req.validated.product;

      const categoriesAndSubCategoriesProducts =
        insertCategoriesAndSub_categories(
          categories,
          sub_categories,
          product_id
        );

      // Patch products
      await Promise.all([
        // delete pivot tables
        Category_product.destroy({
          where: {
            product_id,
          },
        }),

        Sub_category_product.destroy({
          where: {
            product_id,
          },
        }),

        Product.update(
          {
            name,
            slug,
            type,
            description,
            tags,
            stock,
            parts,
            regular_price,
            discount_price,
          },
          {
            where: {
              id: product_id,
            },
          }
        ),
      ]);

      // Insert pivot tables
      await Promise.all(categoriesAndSubCategoriesProducts);

      return res.status(200).json({
        sucess: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  deleteProduct: async (req, res) => {
    console.log("deleteProduct controller reached");

    try {
      const { productId } = req.params;

      const productImages = req.productImages;

      // DELETE ALL ASSOCIATED TABLES FROM DB
      await Promise.all([
        Product.destroy({
          where: {
            id: productId,
          },
        }),

        Product_image.destroy({
          where: {
            product_id: productId,
          },
        }),

        Product_review.destroy({
          where: {
            product_id: productId,
          },
        }),

        Category_product.destroy({
          where: {
            product_id: productId,
          },
        }),

        Sub_category_product.destroy({
          where: {
            product_id: productId,
          },
        }),
      ]);

      // delete all product images from assets
      for (let index = 0; index < productImages.length; index++) {
        const productImageName = productImages[index].file_name;

        fs.unlink(`assets/products/${productImageName}`, (err) => {
          if (err) {
            console.log(err);
            throw `${productImage.id} cannot be found or already deleted`;
          }
        });
      }

      return res.status(200).json({
        sucess: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },

  togglePublishedProduct: async (req, res) => {
    console.log("togglePublishedProduct controller reached");

    try {
      const product = req.product;

      product.published = product.published === 1 ? 0 : 1;

      await product.save();

      return res.status(200).json({
        sucess: true,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        err,
      });
    }
  },
};

const Joi = require("@hapi/joi");

module.exports = {
    validate: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);

            // if error found return
            if (result.error) {
                console.log("Joi validation : ", result.error);
                return res.status(400).json(result.error);
            }

            // create new value properties with validated values
            if (!req.validated) {
                req.validated = {};
            }

            req.validated["product"] = result.value;

            next();
        };
    },

    addProductSchema: Joi.object().keys({
        // product data
        name: Joi.string().required(),
        slug: Joi.string().required(),
        parts: Joi.string().required(),
        stock: Joi.string().required(),
        type: Joi.string().required(),
        description: Joi.string().required(),
        tags: Joi.string().required(),
        regular_price: Joi.number().integer().required(),
        discount_price: Joi.number().integer().required(),

        // pivot ids
        categories: Joi.array()
            .items({
                id: Joi.number().integer().required(),
            })
            .required(),
        sub_categories: Joi.array()
            .items({
                id: Joi.number().integer().required(),
            })
            .required(),
    }),

    patchProductSchema: Joi.object().keys({
        // product data
        name: Joi.string().required(),
        slug: Joi.string().required(),
        type: Joi.string().required(),
        stock: Joi.string().required(),
        parts: Joi.string().required(),
        description: Joi.string().required(),
        tags: Joi.string().required(),
        regular_price: Joi.number().integer().required(),
        discount_price: Joi.number().integer().required(),

        // pivot ids
        categories: Joi.array()
            .items({
                id: Joi.number().integer().required(),
            })
            .required(),
        sub_categories: Joi.array()
            .items({
                id: Joi.number().integer().required(),
            })
            .required(),
    }),
};

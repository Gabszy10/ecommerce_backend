const Joi = require("@hapi/joi");

module.exports = {
    validate: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);

            // if error found return
            if (result.error) {
                console.log("Joi validation : ", result.error);
                return res.status(400).json(result.error.details);
            }

            // create new value properties with validated values
            if (!req.validated) {
                req.validated = {};
            }

            req.validated["order"] = result.value;

            next();
        };
    },

    createOrderSchema: Joi.object().keys({
        orderItems: Joi.array().items({
            productId: Joi.number().integer().required(),
            quantity: Joi.number().integer().required(),
            itemPrice: Joi.number().integer().required(),
            name: Joi.string().required()
        }),
        userId: Joi.number().required(),
        shippingFirstName: Joi.string().required(),
        shippingLastName: Joi.string().required(),
        shippingPhone: Joi.string().required(),
        shippingAddress: Joi.string().required(),
        shippingCity: Joi.string().required(),
        shippingProvince: Joi.string().required(),
        shippingZip: Joi.string().required(),

        message: Joi.string().allow(''),
        deliveryInstructions: Joi.string().required().allow(''),

        billingFirstName: Joi.string().required(),
        billingLastName: Joi.string().required(),
        billingPhone: Joi.string().required(),
        billingEmail: Joi.string().required(),

        deliveryDate: Joi.string().required().allow(''),
        deliveryTime: Joi.string().required().allow(''),
        paymentMethod: Joi.string().required(),
        isCampaign: Joi.bool().required(),
    }),

    sendEmailSchema: Joi.object().keys({
        billingFirstName: Joi.string().required(),
        billingEmail: Joi.string().required(),
        orderName: Joi.string().required(),
        cryptoStr: Joi.string().required(),
        orderItems: Joi.array().items({
            productId: Joi.number().integer().required(),
            quantity: Joi.number().integer().required(),
            itemPrice: Joi.number().integer().required(),
            name: Joi.string().required()
        }),
        deliveryDate: Joi.string().required(),
        paymentMethod: Joi.string().required(),
    }),
};

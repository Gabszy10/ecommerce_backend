const Joi = require("@hapi/joi");

module.exports = {
    validateQuery: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.query);

            // if error found return
            if (result.error) {
                console.log("Joi validation : ", result.error);
                return res.status(400).json(result.error);
            }

            // create new value properties with validated values
            if (!req.validated) {
                req.validated = {};
            }

            req.validated["order"] = result.value;

            next();
        };
    },

    validateBody: (schema) => {
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

            req.validated["order"] = result.value;

            next();
        };
    },

    getAllOrderSchema: Joi.object()
        .keys({
            page: Joi.string(),
            limit: Joi.string(),
            order_name: Joi.string(),
            payment_method: Joi.string(),
            created_at: Joi.string(),
            delivery_time: Joi.string(),
            delivery_date: Joi.string(),
            order_status_id: Joi.string(),
            payment_status_id: Joi.string(),
        })
        .with("page", "limit"),

    updateOrderSchema: Joi.object().keys({
        delivery_date: Joi.string().allow(''),
        delivery_time: Joi.string().allow(''),
        payment_status_id: Joi.number().integer().required(),
        payment_method: Joi.string().required(),
        order_status_id: Joi.number().integer().required(),
    }),
};

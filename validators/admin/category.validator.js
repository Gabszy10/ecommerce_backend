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

            req.validated["category"] = result.value;

            next();
        };
    },

    addCategorySchema: Joi.object().keys({
        name: Joi.string().required(),
        slug: Joi.string().required(),
    }),
};

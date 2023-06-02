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

            req.validated["user"] = result.value;

            next();
        };
    },

    signUpSchema: Joi.object()
        .keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            zip: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        })
        .with("password", "confirmPassword"),

    signInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string(),
    }),
};

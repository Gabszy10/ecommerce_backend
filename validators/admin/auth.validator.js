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

            req.validated["employee"] = result.value;

            next();
        };
    },

    signUpSchema: Joi.object()
        .keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().email(),
            contact_number: Joi.string().required(),
        })
        .with("password", "confirmPassword"),

    signInSchema: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string(),
    }),
};

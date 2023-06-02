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

            req.validated["user"] = result.value;

            next();
        };
    },

    changeUserPasswordSchema: Joi.object()
        .keys({
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
            new_confirm_password: Joi.string().required(),
        })
        .with("new_password", "new_confirm_password"),
};

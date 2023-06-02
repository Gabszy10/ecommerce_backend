const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcryptjs");

// db
const db = require("../../models");
const User = db.users;

module.exports = {
    changePasswordMiddleware: async (req, res, next) => {
        try {
            const { old_password } = req.validated.user;

            const { id } = req.user;

            let user = await User.findOne({
                where: {
                    id,
                },
                attributes: ["id", "password"],
            });

            if (!user) {
                throw "Email not found!";
            }

            const isPasswordMatch = await bcrypt.compare(
                old_password,
                user.password
            );

            if (!isPasswordMatch) {
                throw "The old password is incorrect.";
            }

            next();
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                error,
            });
        }
    },
};

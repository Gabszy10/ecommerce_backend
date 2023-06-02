const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcryptjs");

// db
const db = require("../../models");
const User = db.users;

passport.use(
    "user_local",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {
            console.log("user auth middleware reached");

            try {
                const user = await User.findOne({
                    where: { id: payload.id },
                    attributes: ["id"],
                });

                if (!user) {
                    return done(null, false);
                }

                done(null, user);
            } catch (error) {
                console.log(error);

                done(error, false);
            }
        }
    )
);

module.exports = {
    authMiddleware: passport.authenticate("user_local", { session: false }),

    signUpMiddleware: async (req, res, next) => {
        try {
            const { email } = req.validated.user;

            const user = await User.findOne({
                where: {
                    email,
                },
                attributes: ["email"],
            });

            if (user == null) {
                next();
            } else {
                throw "Email already exists.";
            }
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                error,
            });
        }
    },

    signInMiddleware: async (req, res, next) => {
        try {
            const { email, password } = req.validated.user;

            let user = await User.findOne({
                where: {
                    email,
                },
                // attributes: ["id", "password"],
            });

            if (!user) {
                throw "Email not found!";
            }

            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                throw "Email and password don't match.";
            }

            req.user = user;

            next();
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                error,
            });
        }
    },
};

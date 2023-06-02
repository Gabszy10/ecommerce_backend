const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcryptjs");

// db
const db = require("../../models");
const Employee = db.employees;

passport.use(
    "employee_local",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        },
        async (req, payload, done) => {
            console.log("admin auth middleware reached");

            try {
                const employee = await Employee.findOne({
                    where: { id: payload.id },

                    attributes: ["id"],

                    include: [
                        {
                            model: db.employee_roles,
                        },
                    ],
                });

                if (!employee) {
                    return done(null, false);
                }

                req.employee = {};

                req.employee.id = employee.id;

                req.employee.employee_role_id = employee.employee_role.id;

                done(null, employee);
            } catch (error) {
                console.log(error);

                done(error, false);
            }
        }
    )
);

module.exports = {
    authMiddleware: passport.authenticate("employee_local", { session: false }),

    signUpMiddleware: async (req, res, next) => {
        try {
            const { username } = req.validated.employee;

            const employee = await Employee.findOne({
                where: {
                    username,
                },
                attributes: ["username"],
            });

            if (employee == null) {
                next();
            } else {
                throw "Username already exists.";
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
            const { username, password } = req.validated.employee;

            let employee = await Employee.findOne({
                where: {
                    username,
                },
                attributes: ["id", "password"],
            });

            if (!employee) {
                throw "Username not found!";
            }

            const isPasswordMatch = await bcrypt.compare(
                password,
                employee.password
            );

            if (!isPasswordMatch) {
                throw "Username and password don't match.";
            }

            req.employee = employee;

            next();
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                error,
            });
        }
    },
};

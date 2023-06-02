const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// db
const db = require("../../models");
const Employee = db.employees;

// Generate Token
token = (userId) => {
    return JWT.sign(
        {
            iss: "flowers",
            id: userId,
            iat: Date.now(),
            expiresIn: "30d",
        },
        process.env.JWT_SECRET
    );
};

module.exports = {
    signUpController: async (req, res) => {
        console.log("signUp controller reached");
        try {
            // return console.log(req.validated.employee);

            let {
                username,
                password,
                name,
                email,
                contact_number,
            } = req.validated.employee;

            // Create hash
            const newHashPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await Employee.create({
                username,
                name,
                email,
                contact_number,
                password: newHashPassword,
            });

            // Generate JWT token
            const newToken = token(newUser.id);

            return res.status(200).json({
                token: newToken,
            });
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                success: false,
            });
        }
    },

    signInController: async (req, res) => {
        console.log("signIn controller reached");

        try {
            // Generate JWT token
            const newToken = token(req.employee.id);

            return res.status(200).json({
                token: newToken,
            });
        } catch (error) {
            console.log(error);

            return res.status(400).json({
                success: false,
            });
        }
    },

    employeeDetails: async (req, res) => {
        console.log("userDetails controller reached");

        try {
            const userId = req.employee.id;

            const userDetails = await Employee.findOne({
                where: {
                    id: userId,
                },

                attributes: {
                    exclude: [
                        "password",
                        "created_at",
                        "updated_at",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            });

            if (userDetails === null) throw "user details not found";

            return res.status(200).json({
                userDetails,
            });
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

const bcrypt = require("bcryptjs");

// db
const db = require("../../models");
const User = db.users;

module.exports = {
    userDetails: async (req, res) => {
        console.log("userDetails controller reached");

        try {
            const userId = req.user.id;

            const userDetails = await User.findOne({
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

    changePassword: async (req, res) => {
        console.log("changePassword controller reached");

        try {
            const { id } = req.user;

            const { new_password } = req.validated.user;

            const newHashPassword = await bcrypt.hash(new_password, 10);

            await User.update(
                {
                    password: newHashPassword,
                },
                {
                    where: {
                        id,
                    },
                }
            );

            return res.status(200).json({
                success: true,
            });
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};

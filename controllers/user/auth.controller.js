const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// db
const db = require("../../models");
const User = db.users;

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
      let { firstName, lastName, address, city, zip, email, password } =
        req.validated.user;

      // Create hash
      const newHashPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        first_name: firstName,
        last_name: lastName,
        address,
        city,
        zip,
        email,
        password: newHashPassword,
      });

      // Generate JWT token
      const newToken = token(newUser.id);

      return res.status(200).json({
        token: newToken,
        user: newUser,
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
      const newToken = token(req.user.id);

      return res.status(200).json({
        token: newToken,
        user: req.user,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
      });
    }
  },
};

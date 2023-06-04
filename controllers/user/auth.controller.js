const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// db
const db = require("../../models");
const User = db.tblcustomer;

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
      let { firstName, lastName, address, gender, username, phone, password } =
        req.body;

      // Create hash
      const newHashPassword = await bcrypt.hash(password, 10);
      console.log(password);
      // Create new user
      const newUser = await User.create({
        fname: firstName,
        lname: lastName,
        gender: gender,
        cityadd: address,
        cusuname: username,
        phone: phone,
        cuspass: newHashPassword,
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
      const newToken = token(req.user.CUSTOMERID);

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

const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { hashPassword, validatePassword } = require("../utils/bcrypt");

exports.signup = async (req, res, next) => {
    try {
     const { email, password, role } = req.body
     const hashedPassword = await hashPassword(password);
     const newUser = new User({ email, password: hashedPassword, role: role || "basic" });
     const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     newUser.accessToken = accessToken;
     await newUser.save();
     res.json({
      newUser,
      accessToken
     })
    } catch (error) {
     next(error)
    }
   }
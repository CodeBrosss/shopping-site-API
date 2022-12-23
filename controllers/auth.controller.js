"use strict";

const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { 
    hashPassword, 
    comparePassword 
} = require("../utils/bcrypt");
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');
const {
    validateSignUp,
    validateLogin,
} = require('../validations/user.validation');


// signup funtion
exports.signUp = catchAsync(async (req, res, next) => {
   // validate user body request
   const { error } = validateSignUp(req.body);
   if (error) return next(new AppError(error.message, 400));

   // check if user exists
   const existingUser = await User.findOne({
       email: req.body.email,
   });
   if (existingUser) {
       return next(
           new AppError(
               'User already exist, please use the login route.',
               400
           )
       );
   }

   // hashPassword
   const hashedPassword = await hashPassword(req.body.password, 10);
 
   // create a new user
   const newUser = await User.create({
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       email: req.body.email,
       password: hashedPassword,
       role: req.body.role,
   });

   return res.status(201).json({
       status: 'success',
       message: 'Registration successful',
       user: newUser,
   });
});


// signin function
exports.signIn = async(req, res) => {
    // validate user body request
    const { error } = validateLogin(req.body);
    if (error) return next(new AppError(error.message, 400));
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: "User does not exist"
        })
    }
     
    try {
        const correctPassword = await comparePassword(password, user.password)
        if(!correctPassword) {
            return res.status(400).json({
                message: "Incorrect email or password"
            })
        }
          
        //const user = { id: user.id }
        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
         
        //user.accessToken = accessToken;

        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
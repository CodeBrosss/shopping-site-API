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
exports.signup = catchAsync(async (req, res, next) => {
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
       email: req.body.email,
       password: hashedPassword,
       role: req.body.role,
   });

   //newUser.password = undefined;

   return res.status(201).json({
       status: 'success',
       message: 'Registration successful',
       user: newUser,
   });
});
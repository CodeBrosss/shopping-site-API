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
const { roles } = require("../roles");
require("dotenv").config();


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
   
   try {
    // create a new user
   const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role || "basic",
    });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
    });
    newUser.accessToken = accessToken;
    await newUser.save();

    return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        user: newUser,
    });
   } catch (error) {
     res.status(500).json({
        message: "Internal server error",
        error,
     })
   }
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
          
        const accessToken = jwt.sign(
            { userId: user._id, userRole: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        await User.findByIdAndUpdate(user._id, { accessToken })

        res.status(200).json({
            message: "Login successful",
            user,
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

exports.grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(403).json({
                    error: "You don't have enough permission to perform this action"
                })
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

exports.checkIfLoggedIn = async(req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user) return res.status(401).json({
            error: "You need to log in to access this route"
        })
        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
};

exports.getHeaderToken = async(req, res, next) => {
    if (req.headers['authorization']) {
        const accessToken = req.headers['authorization'].split(' ')[1];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);

        // check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                error: "JWT token has expired, please login to obtain a new one"
            })
        }
        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
}
'use strict'

const User = require('../models/user')
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../utils/bcrypt')
const AppError = require('../utils/appError')
// const catchAsync = require('../utils/catchAsync').default.default;
const {
  validateSignUp,
  validateLogin,
  validateUserEdit,
  validatePasswordChange
} = require('../validations/user.validation')
const { roles } = require('../roles')
require('dotenv').config()
const path = require('path')
const fs = require('fs')

const asyncWrapper = require('../utils/catchAsync')

// get all users
exports.fetchAllUsers = asyncWrapper(async (req, res, next) => {
  const filter = { role: 'basic' }
  const users = await User.find(filter)

  if (!users) return next(new AppError('No users found', 400))

  res.status(200).json({
    status: 'success',
    message: 'Users fetched successfully'
  })
})

// signup funtion
exports.signUp = asyncWrapper(async (req, res, next) => {
  // validate user body request
  const { error } = validateSignUp(req.body)
  if (error) return next(new AppError(error.message, 400))

  // check if user exists
  const existingUser = await User.findOne({
    email: req.body.email
  })

  if (existingUser) {
    return next(
      new AppError('User already exist, please use the login route.', 400)
    )
  }

  // hashPassword
  const hashedPassword = await hashPassword(req.body.password, 10)

  // create a new user
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword
  })
  const accessToken = jwt.sign(
    {
      userId: newUser._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )
  newUser.accessToken = accessToken
  await newUser.save()

  return res.status(201).json({
    status: 'success',
    message: 'Registration successful',
    user: newUser
  })
})

exports.adminSignup = asyncWrapper(async (req, res, next) => {
  // validate user body request
  const { error } = validateSignUp(req.body)
  if (error) {
    console.log(error)
    return next(new AppError(error.message, 400))
  }

  // check if user exists
  const existingAdmin = await Admin.findOne({
    email: req.body.email
  })

  if (existingAdmin) {
    return next(
      new AppError('Admin already exist, please use the login route.', 400)
    )
  }

  // hashPassword
  const hashedPassword = await hashPassword(req.body.password, 10)

  try {
    // create a new user
    const newAdmin = new Admin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      photo: {
        storagePath: req.file.path,
        contentType: req.file.mimetype
      }
    })

    const accessToken = jwt.sign(
      {
        userId: newAdmin._id,
        userRole: newAdmin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    newAdmin.accessToken = accessToken
    await newAdmin.save()
    console.log('here3')
    return res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      newAdmin
    })
  } catch (error) {

    res.status(500).json({
      message: 'Internal server error',
      error: error
    })
  }
})

// signin function
exports.signIn = asyncWrapper(async (req, res) => {
  // validate user body request
  const { error } = validateLogin(req.body)
  if (error) return next(new AppError(error.message, 400))
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      message: 'User does not exist'
    })
  }

  const correctPassword = await comparePassword(password, user.password)
  if (!correctPassword) {
    return res.status(400).json({
      message: 'Incorrect email or password'
    })
  }

  const accessToken = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  await User.findByIdAndUpdate(user._id, { accessToken })

  res.status(200).json({
    message: 'Login successful',
    user
  })
})

exports.adminSignIn = async (req, res, next) => {
  // validate user body request
  const { error } = validateLogin(req.body)
  console.log(req.body)
  if (error) return next(new AppError(error.message, 400))
  const { email, password } = req.body

  const admin = await Admin.findOne({ email })
  if (!admin) {
    return res.status(404).json({
      message: 'Admin not found.'
    })
  }

  try {
    const correctPassword = await comparePassword(password, admin.password)
    if (!correctPassword) {
      return res.status(400).json({
        message: 'Incorrect email or password'
      })
    }

    const accessToken = jwt.sign(
      { userId: admin._id, userRole: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    await Admin.findByIdAndUpdate(admin._id, { accessToken })

    res.status(200).json({
      message: 'Administrator login successful',
      accessToken: admin.accessToken
    })
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
}

exports.editUser = asyncWrapper(async (req, res, next) => {
  const { error } = validateUserEdit(req.body)
  if (error) return next(new AppError('Invalid input', 400))

  const id = req.user.id

  let newUser = await {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  }

  let update = await User.findOneAndUpdate({ _id: id }, newUser, { new: true })

  res.status(200).json({
    message: 'User information updated successfuly',
    update
  })
})

exports.editAdmin = asyncWrapper(async (req, res) => {
  const id = req.user.id
  const oldAdmin = await Admin.findOne({ _id: id })

  let newAdmin = await {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  }

  if (req.file) {
    // delete old image
    const imagePath = oldAdmin.photo.storagePath
    fs.unlinkSync(path.join(imagePath))

    newAdmin.photo = await {
      storagePath: req.file.path,
      contentType: req.file.mimetype
    }
  }

  let update = await Admin.findOneAndUpdate({ _id: id }, newAdmin, {
    new: true
  })

  res.status(200).json({
    message: 'Admin profile updated successfuly',
    update
  })
})

exports.changeUserPassword = asyncWrapper(async (req, res, next) => {
  // validate req body
  const { error } = validatePasswordChange(req.body)
  if (error) return next(new AppError(error.message, 400))

  const { oldPassword, newPassword } = req.body
  const id = req.params.userId
  const user = await User.findOne({ _id: id })

  const correctPassword = await comparePassword(oldPassword, user.password)
  if (!correctPassword) {
    res.status(400).json({
      message: 'Old password is incorrect'
    })
  }

  const newHashedPassword = await hashPassword(newPassword, 10)
  const passwordUpdate = await {
    password: newHashedPassword
  }

  const update = await User.findOneAndUpdate({ _id: id }, passwordUpdate, {
    new: true
  })

  res.status(200).json({
    message: 'Password changed successfully',
    update
  })
})

exports.changeAdminPassword = asyncWrapper(async (req, res, next) => {
  // validate req body
  const { error } = validatePasswordChange(req.body)
  if (error) return next(new AppError(error.message, 400))

  const { oldPassword, newPassword } = req.body
  const id = req.user
  const admin = await Admin.findOne({ _id: id })

  const correctPassword = await comparePassword(oldPassword, admin.password)
  if (!correctPassword) {
    res.status(400).json({
      message: 'Old password is incorrect'
    })
  }

  const newHashedPassword = await hashPassword(newPassword, 10)
  const passwordUpdate = await {
    password: newHashedPassword
  }

  const update = await Admin.findOneAndUpdate({ _id: id }, passwordUpdate, {
    new: true
  })

  res.status(200).json({
    message: 'Administrator password changed successfully'
  })
})

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource)
      if (!permission.granted) {
        return res.status(403).json({
          error: "You don't have enough permissions to perform this action"
        })
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.checkIfLoggedIn = asyncWrapper(async (req, res, next) => {
  const user = res.locals.loggedInUser
  if (!user)
    return res.status(401).json({
      error: 'You need to log in to access this route'
    })
  req.user = user
  next()
})

exports.getHeaderToken = async (req, res, next) => {
  try {
    if (req.headers['authorization']) {
      const accessToken = req.headers['authorization'].split(' ')[1]
      const { userId, userRole } = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET
      )

      if (userRole == 'admin') {
        res.locals.loggedInUser = await Admin.findById(userId)
      } else {
        res.locals.loggedInUser = await User.findById(userId)
      }
      next()
    } else {
      next()
    }
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      res.status(401).json({
        message: 'Token expired, login to get new token',
        error
      })
    } else {
      res.status(500).json({
        message: 'Internal server error',
        error
      })
    }
  }
}

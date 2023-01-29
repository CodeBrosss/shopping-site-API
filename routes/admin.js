const express = require('express')
const router = express.Router()
const {
  adminSignup,
  adminSignIn,
  changeAdminPassword,
  getHeaderToken,
  checkIfLoggedIn,
  grantAccess,
  editAdmin
} = require('../controllers/auth.controller')
// const path = require('path')
// const Admin = require('../models/admin')
const { upload } = require('../middlewares/cloudinary')
const expressBusboy = require('express-busboy')

router.route('/signup').post(upload.single('picture'), adminSignup)
expressBusboy.extend(router).route('/signin').post(adminSignIn)

router
  .route('/password/edit')
  .put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess('updateOwn', 'password'),
    changeAdminPassword
  )
router
  .route('/edit')
  .put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess('updateOwn', 'profile'),
    upload.single('picture'),
    editAdmin
  )

module.exports = router

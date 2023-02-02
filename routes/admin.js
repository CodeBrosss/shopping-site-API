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

const { upload } = require('../middlewares/cloudinary')


router.route('/signup').post(upload.single('picture'), adminSignup)
router.route('/signin').post(adminSignIn)

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

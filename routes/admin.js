const express = require('express')
const router = express.Router()
const {
  adminSignup,
  adminSignIn,
  changeAdminPassword,
  deleteUser,
  getHeaderToken,
  checkIfLoggedIn,
  grantAccess,
  editAdmin,
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

  router.route("/:userId/delete").delete(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("deleteAny", "account"),
    deleteUser
)  

module.exports = router

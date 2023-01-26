const express = require("express");
const router = express.Router();
const { adminSignup, 
        adminSignIn,
        changeAdminPassword,
        getHeaderToken,
        checkIfLoggedIn,
        grantAccess,
        editAdmin,
} = require("../controllers/auth.controller");
const path = require("path");
const Admin = require("../models/admin");
const uploadPath = path.join('public', Admin.adminPhotoBasePath)
const imageMimeTypes = ["image/jpg", "image/png", "image/gif"]
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeTypes.includes(file.mimetype))
    }
})
const upload = multer({ storage: storage })

router.route("/signup").post(
    upload.single("picture"),
    adminSignup
);

router.route("/signin").post(
    adminSignIn
);

router.route("/password/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "password"),
    changeAdminPassword
);
router.route("/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateOwn", "profile"),
    upload.single("picture"),
    editAdmin
)

module.exports = router;
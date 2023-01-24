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
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]
const multer  = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
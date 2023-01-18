const express = require("express");
const router = express.Router();
const { adminSignup, adminSignIn } = require("../controllers/auth.controller");
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

module.exports = router;
const express = require("express");
const router = express.Router();
const { adminSignup } = require("../controllers/auth.controller");
const path = require("path");
const User = require("../models/user");
const uploadPath = path.join('public', User.adminPhotoBasePath)
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

module.exports = router;
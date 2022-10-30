const express = require("express");
const router = express.Router();
const {
    newProduct,
    createProduct
} = require("../controllers/product.controller");
const path = require("path");
const Product = require("../models/product");
const uploadPath = path.join('public', Product.productImageBasePath)
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]
const multer  = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.route("/upload") 
    .post(
    upload.single('picture'),
    createProduct
    );

module.exports = router;
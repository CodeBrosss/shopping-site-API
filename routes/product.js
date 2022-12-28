const express = require("express");
const router = express.Router();
const {
    createProduct,
    fetchAllProducts,
    fetchProduct,
    editProduct,
    deleteProduct,
    toggleFavourite,
    toggleLike
} = require("../controllers/product.controller");
const {
    checkIfLoggedIn,
    grantAccess,
    getHeaderToken,
} = require("../controllers/auth.controller")
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
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("createOwn", "product"),
    upload.single('picture'),
    createProduct,
);

router.route("/").get(fetchAllProducts);

router.route("/:id").get(fetchProduct);


router.route("/:id/edit").put(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("updateAny", "product"),
    upload.single('picture'),
    editProduct
);
    
router.route("/:id/delete").delete(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("deleteAny", "product"),
    deleteProduct,
);    

router.route("/:productId/toggle-favourite").post(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("createOwn", "favourite"),
    toggleFavourite
); 

router.route("/:productId/toggle-like").post(
    getHeaderToken,
    checkIfLoggedIn,
    grantAccess("createOwn", "like"),
    toggleLike,
)

module.exports = router;
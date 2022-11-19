const Product = require("../models/product");
const {
    validateProduct,
} = require("../validations/product.validation");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const fs = require("node:fs");
const path = require("path");


// upload new product
exports.createProduct = catchAsync(async(req, res, next) => {
    // validate request
    const isValidRequest = await validateProduct(req.body);
    if (!isValidRequest) {
        return next(
            new AppError(
                "All fields required",
                400
            )
        )
    }
     
    // check if product already exists in db
    const { title } = req.body;
    const isCreatedAlready = await Product.findOne({ title });
    if (isCreatedAlready) {
        res.status(403).json({
            message: "Product with this title already exists"
        })
    }

    try {
        // save new product req to db
        const newProduct = await Product.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            productImage: {
                storagePath: path.join('public', "/uploads/productImages/" + req.file.filename),
                data: fs.readFileSync(path.join('public', "/uploads/productImages/" + req.file.filename)),
                contentType: req.file.mimetype
            }
        })
         
        res.status(200).json({
            message: "Product created successfully",
            productPath: newProduct.productImage.storagePath,
            id: newProduct.id
        })
    } catch (error) {
        res.status(500).json({
            messaage: "Internal server error, could not create product",
            error: error
        })
        console.log(error);
    }
})


// fetch all products
exports.fetchAllProducts = catchAsync(async(req, res) => {
    let filter = {};
    if (req.query) filter = req.query;
    const products = await Product.find(filter);
    res.status(200).json({
        status: 'success',
        message: 'Product fetched successfully',
    });
})


// fetch single product
exports.fetchProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product)
        return next(
            new AppError('Product not found or does not exist', 404)
        );
    res.status(200).json({
        status: 'success',
        message: 'Product fetched successfully',
        product: product.title
    });
});


// update product
exports.editProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const oldProduct = await Product.findOne({ _id: id })
    console.log(oldProduct.title);
    try {
        let newProduct = await {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        }
    
        if (req.file) {
            // delete old image
            const imagePath =  oldProduct.productImage.storagePath;
             
            fs.unlinkSync(path.join(imagePath));
             
            newProduct.productImage = {
                storagePath: path.join('public', "/uploads/productImages/" + req.file.filename),
                data: fs.readFileSync(path.join('public', "/uploads/productImages/" + req.file.filename)),
                contentType: req.file.mimetype
            }
             
        }
    
        let update = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true });

        res.status(200).json({
            message: "Product updated successfuly",
            update: update.productImage.storagePath
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Internal server error",
            error: error.message
        })
    }
})
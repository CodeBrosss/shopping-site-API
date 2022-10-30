const Product = require("../models/product");
const {
    validateProduct,
} = require("../validations/product.validation");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]


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
            productImage: req.file.path
        })

        res.status(200).json({
            message: "Product created successfully",
        })
    } catch (error) {
        res.status(500).json({
            messaage: "Internal server error, could not create product",
            error: error
        })
        console.log(error);
    }
})
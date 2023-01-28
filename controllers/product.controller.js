const Product = require("../models/product");
const {
    validateProduct,
} = require("../validations/product.validation");
const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync").default.default;
const fs = require("fs");
const path = require("path");
//const { uploadFile } = require('../config/googleDrive');
const Favourite = require("../models/favourite");
const ProductLike = require("../models/likes");
const User = require("../models/user");

const asyncWrapper = require('../utils/catchAsync');


// upload new product
exports.createProduct = asyncWrapper(async(req, res, next) => {
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
        res.status(400).json({
            message: "Product with this title already exists"
        })
    }
    // upload file to google drive
    //await uploadFile(req.file);

    // save new product req to db
    const newProduct = await Product.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        productImage: {
            storagePath: `public/uploads/productImages/${req.file.filename}`,
            contentType: req.file.mimetype,
        }
    })
         
    res.status(201).json({
        message: "Product created successfully",
        newProduct,
    })
    
});

// fetch all products
exports.fetchAllProducts = asyncWrapper(async(req, res) => {
    let filter = {};
    if (req.query) filter = req.query;
     
    let title = filter.title
    const products = await Product.find({$or: [
            {
                title: {
                    $regex: new RegExp("^" + title),
                    $options: "i"
                }
            },
            {
                title: {
                    $regex: new RegExp(title + "$"),
                    $options: "i"
                }
            }
        ]
    })
     
    res.status(200).json({
        status: 'success',
        message: 'Products fetched successfully',
        products,
    });
})

// fetch single product
exports.fetchProduct = asyncWrapper(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product)
        return next(
            new AppError('Product not found or does not exist', 404)
        );
    res.status(200).json({
        status: 'success',
        message: 'Product fetched successfully',
        product,
    });
});

// edit product
exports.editProduct = asyncWrapper(async (req, res) => {
    const id = req.params.id;
    const oldProduct = await Product.findOne({ _id: id })
    
    
    let newProduct = await {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    }
    
    if (req.file) {
        // delete old image
        const imagePath =  oldProduct.productImage.storagePath;
        fs.unlinkSync(path.join(imagePath));
             
            newProduct.productImage = {
                storagePath: req.file.path,
                contentType: req.file.mimetype
            }
    }
    
    let update = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true });

    res.status(200).json({
        message: "Product updated successfuly",
        update,
    });
    
});

// delete product
exports.deleteProduct = asyncWrapper(async(req, res) => {
    // delete product image from server
    console.log(req.params.id)
    const product = await Product.findOne({ _id: req.params.id })
    console.log("here")
    const imagePath =  product.productImage.storagePath;
    console.log("here1")
    fs.unlinkSync(path.join(imagePath));
    console.log("her2")
    // delete from db
    const deleted = await Product.deleteOne({ _id: req.params.id })
    if (!deleted) res.status(400).json({
        message: "Failed to delete product"
    })

    const like = await ProductLike.findOne({ product: product.id })
    if (like) {
        const likeDeleted = await ProductLike.deleteOne({ _id: like.id })
        if (!likeDeleted) {
            res.status(400).json({ message: "Product deleted but failed to delete like" })
        }
    }

    res.status(200).json({
        message: "Product deleted successfully",
        deleted,
    });
});

// toggle favourite
exports.toggleFavourite = asyncWrapper(async(req, res) => {
    
    const product = await Product.findOne({ _id: req.params.productId});
    if (!product)
        return next(
            new AppError('Product not found or does not exist', 404)
    );

    const favouriteExists = await Favourite.findOne({
        user: req.user._id,
        product: product.id
    });

    if (!favouriteExists) {
        const favourite = await Favourite.create({
            user: req.user._id,
            product: product._id,
        });
    
        await User.updateOne(
            { _id: req.user._id }, 
            { $push: {favourites: favourite} }
        )
    
        res.status(200).json({
            status: 'success',
            message: 'Favourite saved successfully',
            favourite,
        });
    } else {
        await Favourite.deleteOne({
            _id: favouriteExists._id
        })

        await User.updateOne(
            { _id: req.user._id }, 
            { $pull: {favourites: favouriteExists._id} }
        )
    
        res.status(200).json({ 
            message: "Favourite removed successfully" 
        })
    }
});

// get all user favourites
exports.fetchFavourites = asyncWrapper(async (req, res, next) => {
    
    const filter = { user: req.user._id }
         
    const favourites = await Favourite.find(filter);
    res.status(200).json({
        status: 'success',
        message: 'Favourites fetched successfully',
        favourites,
    });
    
});

// like and unlike
exports.toggleLike = asyncWrapper(async (req, res, next) => {
    let productId = req.params.productId;
    const product = await Product.findOne({ _id: productId });
    if (!product) return next(new AppError(
        "No product found", 400
    ))
     
    const currentUser = req.user;
    const currentUserLike = await ProductLike.findOne({
        product: productId,
        user: currentUser._id
    })
     console.log("here1")
    if (!currentUserLike) {
        console.log("here2")
        const likeData = await ProductLike.create({
            product: productId,
            user: currentUser._id
        })
        console.log("here3")
        await Product.updateOne(
            { _id: productId }, 
            { $push: {likes: likeData._id} }
        )
        res.status(200).json({ 
            message: "Liked successfully" 
        })
    } else {
        console.log("here4")
        await ProductLike.deleteOne({ 
            _id: currentUserLike._id 
        })
        console.log("here5")
        await Product.updateOne(
            { _id: productId }, 
            { $pull: {likes: currentUserLike._id} }
        )
         
        res.status(200).json({ 
            message: "You unliked this product" 
        })
    }
});

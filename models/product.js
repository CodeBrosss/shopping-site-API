const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productImageBasePath = "uploads/productImages";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    productImage: {
        storagePath: { type: String },
        data: Buffer,
        contentType: String
    }
})
 


const Product = mongoose.model("Product", productSchema);
module.exports = Product;
module.exports.productImageBasePath = productImageBasePath;
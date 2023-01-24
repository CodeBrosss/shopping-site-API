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
    category: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "ProductLike"
    }],
    productImage: {
        storagePath: { type: String },
        contentType: String
    }
})
 


const Product = mongoose.model("Product", productSchema);
module.exports = Product;
module.exports.productImageBasePath = productImageBasePath;
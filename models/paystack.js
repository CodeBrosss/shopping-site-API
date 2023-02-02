const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paystackSchema = new Schema({
    reference: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number
    }],
    deliveryLocation: String
})

const Paystack = mongoose.model("Paystack", paystackSchema);
module.exports = Paystack;
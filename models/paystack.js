const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paystackSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    reference: {
        type: String,
        required: true
    }
})

const Paystack = mongoose.model("Paystack", paystackSchema);
module.exports = Paystack;
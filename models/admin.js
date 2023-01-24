const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminPhotoBasePath = "uploads/adminPhoto";

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin"
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: "favourite"
    }],
    photo: {
        storagePath: { type: String },
        contentType: String
    },
    sales: [{
        type: Schema.Types.ObjectId,
        ref: "Paystack"
    }],
    accessToken: {
        type: String
    }
})

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
module.exports.adminPhotoBasePath = adminPhotoBasePath;
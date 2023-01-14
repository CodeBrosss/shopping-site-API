const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminPhotoBasePath = "uploads/adminPhoto";

const userSchema = new Schema({
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
        default: "basic",
        enum: ["admin", "basic"]
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: "favourite"
    }],
    photo: {
        storagePath: { type: String },
        data: Buffer,
        contentType: String
    },
    accessToken: {
        type: String
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;
module.exports.adminPhotoBasePath = adminPhotoBasePath;
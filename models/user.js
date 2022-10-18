const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        default: "basic",
        enum: ["admin", "basic"]
    },
    accessToken: {
        type: String
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;
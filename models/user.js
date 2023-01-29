const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    },
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: "favourite"
    }],
    accessToken: {
        type: String
    }
})

// const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);
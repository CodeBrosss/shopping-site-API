const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const favouriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    }
});

const favourite = mongoose.model("favourite", favouriteSchema);
module.exports = favourite; 
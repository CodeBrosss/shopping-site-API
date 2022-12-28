const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const likesSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

likesSchema.index({ user: 1, like: 1 }, { unique: true });
const ProductLike = mongoose.model("ProductLike", likesSchema);
module.exports = ProductLike;
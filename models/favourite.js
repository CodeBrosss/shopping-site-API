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

favouriteSchema.index({ user: 1, favourite: 1 }, { unique: true });
// const favourite = mongoose.model("favourite", favouriteSchema);
module.exports = mongoose.model("favourite", favouriteSchema);
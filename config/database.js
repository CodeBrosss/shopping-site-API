const mongoose = require("mongoose");
newFunction();

function newFunction() {
    const dotenv = require("dotenv");
    dotenv.config();
}

async function connectDB(cb) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected succesfully');
        cb();
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB };
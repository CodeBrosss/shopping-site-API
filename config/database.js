const mongoose = require("mongoose");
newFunction();

function newFunction() {
    const dotenv = require("dotenv");
    dotenv.config();
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected succesfully');
        return;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB };
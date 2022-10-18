const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
dotenv.config();



connectDB(() => {
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server running on ${process.env.PORT}`)
    })
})
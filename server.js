const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
dotenv.config();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/auth", authRouter);

connectDB(() => {
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server running on ${process.env.PORT}`)
    })
})
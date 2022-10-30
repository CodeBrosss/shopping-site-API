const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const dotenv = require("dotenv");
dotenv.config();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cors = require("cors");
// const ejs = require("ejs");

// app.set("view engine", "ejs")
// app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);

connectDB(() => {
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server running on ${process.env.PORT}`)
    })
})
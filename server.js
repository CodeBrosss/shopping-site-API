require('dotenv').config()
const express = require('express')
const app = express()
const { connectDB } = require('./config/database')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const cors = require('cors')
const bodyParser = require('body-parser')
const paystackRouter = require('./routes/paystack')
const NotFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use('/api/v1/', indexRouter)
app.use('/api/v1/auth/admin', adminRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/paystack', paystackRouter)

app.use(NotFound)
app.use(errorHandler)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`server started on ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()

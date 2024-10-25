const express = require('express')
const cors = require('cors')
const authRouters = require('./routes/auth.route')
const userRouters = require('./routes/user.route')
const adminRouter = require('./routes/admin.route')
const productRouter = require('./routes/product.route')
const adminProductRouter = require('./routes/adminProduct.route')
const cartRouter = require('./routes/cart.route')
const cartItemRouter = require('./routes/cartItem.route')
const orderRouter = require('./routes/order.route')
const adminOrderRouter = require('./routes/adminOrder.route')
const reviewRouter = require('./routes/review.route')
const ratingRouter = require('./routes/rating.route')
const categoryRouter = require('./routes/category.route')
const paymentRouter = require('./routes/payment.route')
const app = express()
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors())
app.get("/",(req,res) => {
    return res.status(200).send({message : "Welcome to ecommerce api -node",status:true})
})

app.use('/auth',authRouters)

app.use('/api/users',userRouters)

app.use('/api/admin',adminRouter)

app.use('/api/products',productRouter)

app.use('/api/admin/products',adminProductRouter)

app.use('/api/cart',cartRouter)

app.use('/api/cart_items',cartItemRouter)

app.use('/api/orders',orderRouter)

app.use('/api/admin/orders',adminOrderRouter)

app.use('/api/reviews',reviewRouter)

app.use('/api/ratings',ratingRouter)

app.use('/api/categories',categoryRouter)

app.use('/api/payment',paymentRouter)
module.exports = app
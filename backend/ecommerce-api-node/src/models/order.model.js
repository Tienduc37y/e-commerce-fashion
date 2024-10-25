const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderItems",
        }
    ],
    orderDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    deliveryDate: {
        type: Date,
    },
    shippingAddress: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "address"
        },
        address: {
            firstName:{
                type:String,
                required:true
            },
            lastName:{
                type:String,
                required:true
            },
            streetAddress:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            district:{
                type:String,
                required:true
            },
            ward:{
                type:String,
                required:true
            },
            mobile: {
                type:Number,
                required:true,
            }
        }
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'ZALOPAY'],
        },
        transactionId: {
            type: String
        },
        paymentId: {
            type: String
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed'],
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalDiscountedPrice: {
        type: Number,
        required: true
    },
    totalItem: {
        type: Number,
        required: true
    },
    discounte: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Order = mongoose.model("orders",orderSchema)
module.exports = Order

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        require: true
    },
    role: {
        type: String,
        required:true,
        default:"CUSTOMER"
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "adresses"
    }],
    tokens:{
        access:{
            token: {
                type: String,
            },
            expiresAt: {
                type: Date,
            }
        },
        refresh:{
            token: {
                type: String,
            },
            expiresAt: {
                type: Date,
            }
        }
    },
    paymentInfomation:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "payment_infomation"
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ratings"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reviews"
        }
    ],
    tokenResetPassword: {
        token:{
            type: String
        },
        expiresTime: {
            type: Date
        }
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
})

const User = mongoose.model("users",userSchema)
module.exports = User
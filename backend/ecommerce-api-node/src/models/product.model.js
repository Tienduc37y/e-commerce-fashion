const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
    },
    discountedPersent: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
    },
    sizes: [{
        size : {
            type: String,
            required: true
        },
        colors: [{
            color:{
                type: String,
                required: true,
            },
            quantityItem: {
                type: Number,
                required: true
            }
        }]
        
    }],
    imageUrl: [{
        color: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }   
    }],
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
    numRatings: {
        type: Number,
        default: 0
    },
    category: {
        topLevelCategory: {
            type: String,
            required: true
        },
        secondLevelCategory: {
            type: String,
            required: true
        },
        thirdLevelCategory: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    
})

const Product = mongoose.model("products",productSchema)
module.exports = Product
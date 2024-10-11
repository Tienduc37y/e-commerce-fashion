const mongoose = require('mongoose')

const categoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    }
}, { _id: false });

const categorySchema = new mongoose.Schema({
    topLevelCategory: {
        type: [categoryItemSchema],
        required: true
    },
    secondLevelCategory: {
        type: [categoryItemSchema],
        required: true
    },
    thirdLevelCategory: {
        type: [categoryItemSchema],
        required: true
    }
});

const Category = mongoose.model("categories", categorySchema)
module.exports = Category
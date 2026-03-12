const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    rating: {
        rate: {
            type: Number,
         
        },
        count: {
            type: Number,
                   }
    },

    images: [{
        type: String
    }]

}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product
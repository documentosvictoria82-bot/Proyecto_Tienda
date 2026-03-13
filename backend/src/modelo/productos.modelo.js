const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,

    rating: {
        rate: Number,
        count: Number
    },

    image: String

},{
    timestamps: true
})

// FORZAMOS el nombre de la colección
module.exports = mongoose.model("Product", productSchema, "productos")
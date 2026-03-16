const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,

   rating: {
    rate: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
},

    image: String

},{
    timestamps: true
})

// FORZAMOS el nombre de la colección
module.exports = mongoose.model("Product", productSchema, "productos")
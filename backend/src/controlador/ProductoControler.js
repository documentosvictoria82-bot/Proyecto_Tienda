const Product = require('../modelo/productos.modelo')
const express = require('express')

// Obtener todos los productos
const ObtenerTodo = async (req, res) => {

    try {

        const productos = await Product.find()

        res.status(200).json(productos)

    } catch (error) {

        res.status(500).json({
            error: "Error al obtener los productos"
        })

    }

}


// Obtener producto por ID
const ObtenerPorID = async (req, res) => {

    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            error: "No se proporciona id"
        })
    }

    try {

        const producto = await Product.findById(id)

        if (!producto) {
            return res.status(404).json({
                error: "No existe el producto"
            })
        }

        res.status(200).json(producto)

    } catch (error) {

        res.status(500).json({
            error: "Error al buscar el producto"
        })

    }

}


// Crear producto
const CrearUnProducto = async (req, res) => {

    try {

         const nuevoProducto= new Product(req.body)
         console.log(nuevoProducto)
        await nuevoProducto.save();
        console.log(nuevoProducto)
        res.status(201).json(nuevoProducto)

            // name: body.name,
            // description: body.description,
            // price: parseFloat(body.price),
            // stock: parseInt(body.stock),
            // category: body.category,

            // rating: {
            //     rate: parseFloat(body.rating.rate),
            //     count: parseInt(body.rating.count)
            // },

            // images: req.file ? [req.file.filename] : []

       // })

        // const productoGuardado = await nuevoProducto.save()
        // console.log(nuevoProducto)
        // res.status(201).json(productoGuardado)

    } catch (error) {

        res.status(400).json({
            error: "Los datos enviados son incorrectos",
            details: error.message
        })

    }

}

module.exports = {
    ObtenerTodo,
    ObtenerPorID,
    CrearUnProducto
}

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

// Modificar un producto
const ModificarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el id de la URL
        const datosActualizados = req.body; // Obtenemos los nuevos datos

        // Buscamos y actualizamos
        const productoActualizado = await Product.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.status(200).json({ 
            mensaje: "Producto actualizado con éxito", 
            producto: productoActualizado 
        });
    } catch (error) {
        console.error("Error al modificar producto:", error);
        res.status(500).json({ mensaje: "Error al modificar el producto", error: error.message });
    }
};

// Eliminar un producto
const EliminarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el id de la URL

        // Buscamos y eliminamos
        const productoEliminado = await Product.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.status(200).json({ mensaje: "Producto eliminado con éxito", producto: productoEliminado });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ mensaje: "Error al eliminar el producto", error: error.message });
    }
};

module.exports = {
    ObtenerTodo,
    ObtenerPorID,
    CrearUnProducto,
    ModificarProducto,
    EliminarProducto
}

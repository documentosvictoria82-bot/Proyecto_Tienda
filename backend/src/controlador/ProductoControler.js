const Product = require('../modelo/productos.modelo')
const express = require('express')
const fs = require("fs");
const path = require("path");

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

        const { name, description, price, stock, category } = req.body;

        const nuevoProducto = new Product({
            name,
            description,
            price,
            stock,
            category,
            image: req.file ? `/uploads/${req.file.filename}` : ""
        });

        console.log("PRODUCTO A GUARDAR:", nuevoProducto);

        await nuevoProducto.save();

        res.status(201).json(nuevoProducto);

    } catch (error) {

        res.status(400).json({
            error: "Los datos enviados son incorrectos",
            details: error.message
        });

    }

};

const calificarProducto = async (req, res) => {

try{

const { id } = req.params
const { rating } = req.body

const producto = await Product.findById(id)

if(!producto){
return res.status(404).json({mensaje:"Producto no encontrado"})
}

// si no existe rating lo creamos
if(!producto.rating){
producto.rating = { rate:0, count:0 }
}

// calcular promedio
const total = producto.rating.rate * producto.rating.count

producto.rating.count += 1
producto.rating.rate = (total + rating) / producto.rating.count

await producto.save()

res.json({
mensaje:"Calificación guardada",
producto
})

}catch(error){

res.status(500).json({
error:error.message
})

}

}

// Modificar un producto
const ModificarProducto = async (req, res) => {
    try {

        const { id } = req.params;

        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

const datosActualizados = {};

// solo agregar si vienen datos
if (req.body.name) datosActualizados.name = req.body.name;
if (req.body.description) datosActualizados.description = req.body.description;
if (req.body.category) datosActualizados.category = req.body.category;

// números seguros
if (req.body.price !== undefined) {
    datosActualizados.price = Number(req.body.price);
}

if (req.body.stock !== undefined) {
    datosActualizados.stock = Number(req.body.stock);
}

// imagen
// ✅ seguro en Vercel
if (req.file && req.file.filename) {
    datosActualizados.image = `/uploads/${req.file.filename}`;
}


        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        );

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto: productoActualizado
        });

    } catch (error) {

        console.error("ERROR REAL:", error); // 👈 déjalo para debug

        res.status(500).json({
            mensaje: "Error al actualizar el producto",
            error: error.message // 👈 esto te ayuda mucho
        });

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
    EliminarProducto,
    calificarProducto
}

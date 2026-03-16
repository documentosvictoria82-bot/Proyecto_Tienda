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

// Modificar un producto
const ModificarProducto = async (req, res) => {

    try {

        const { id } = req.params;

        // Buscar el producto actual
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        const datosActualizados = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        };

        // Si se sube una nueva imagen
        if (req.file) {

            // Eliminar imagen anterior si existe
            if (producto.image) {

                const rutaImagen = path.join(__dirname, "../../public", producto.image);

                fs.unlink(rutaImagen, (err) => {
                    if (err) {
                        console.log("No se pudo eliminar la imagen anterior:", err);
                    }
                });

            }

            // Guardar nueva imagen
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

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
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
    EliminarProducto
}

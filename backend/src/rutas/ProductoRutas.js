const express = require('express')
const ruta = express.Router()

const { 
    ObtenerTodo, 
    ObtenerPorID, 
    CrearUnProducto, 
    ModificarProducto, 
    EliminarProducto 
} = require('../controlador/ProductoControler')

const upload = require('../../Utilidades/multer')


// OBTENER TODOS
ruta.get('/producto', ObtenerTodo)

// OBTENER POR ID
ruta.get('/producto/:id', ObtenerPorID)

// CREAR PRODUCTO
ruta.post('/producto', upload.single('imagen'), CrearUnProducto)

// ACTUALIZAR PRODUCTO
ruta.put('/producto/update/:id', upload.single('imagen'), ModificarProducto)

// ELIMINAR PRODUCTO
ruta.delete('/producto/delete/:id', EliminarProducto)

module.exports = ruta
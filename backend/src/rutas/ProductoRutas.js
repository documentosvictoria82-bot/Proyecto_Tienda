const express = require('express')
const ruta = express.Router()

const { 
    ObtenerTodo, 
    ObtenerPorID, 
    CrearUnProducto, 
    ModificarProducto, 
    EliminarProducto,
    calificarProducto
} = require('../controlador/ProductoControler')

const upload = require('../../Utilidades/multer')


// OBTENER TODOS
ruta.get('/productos', ObtenerTodo)

// OBTENER POR ID
ruta.get('/productos/:id', ObtenerPorID)

// CREAR PRODUCTO
ruta.post('/productos', upload.single('imagen'), CrearUnProducto)

// ACTUALIZAR PRODUCTO
ruta.put('/productos/update/:id', upload.single('imagen'), ModificarProducto)
ruta.get('/productos', ObtenerTodo)
ruta.get('/productos/:id', ObtenerPorID)
ruta.post('/productos', upload.single('imagen'), CrearUnProducto)
ruta.post("/productos/:id/rating", calificarProducto)


//ruta.put("/update", verificarToken,  ModificarProducto);


// ELIMINAR PRODUCTO
ruta.delete('/productos/delete/:id', EliminarProducto)

module.exports = ruta
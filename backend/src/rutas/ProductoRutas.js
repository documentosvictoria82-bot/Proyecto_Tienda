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


<<<<<<< HEAD
// OBTENER TODOS
ruta.get('/producto', ObtenerTodo)

// OBTENER POR ID
ruta.get('/producto/:id', ObtenerPorID)

// CREAR PRODUCTO
ruta.post('/producto', upload.single('imagen'), CrearUnProducto)

// ACTUALIZAR PRODUCTO
ruta.put('/producto/update/:id', upload.single('imagen'), ModificarProducto)
=======
ruta.get('/productos', ObtenerTodo)
ruta.get('/productos/:id', ObtenerPorID)
ruta.post('/productos', upload.single('imagen'), CrearUnProducto)


ruta.put("/update", verificarToken,  ModificarProducto);
ruta.delete("/delete/:id", verificarToken, EliminarProducto);
>>>>>>> b8969ed7fb7427f57168901d020ddee23f874774

// ELIMINAR PRODUCTO
ruta.delete('/producto/delete/:id', EliminarProducto)

module.exports = ruta
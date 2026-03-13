const express = require('express')
const ruta = express.Router()
const {ObtenerTodo, ObtenerPorID, CrearUnProducto, ModificarProducto, EliminarProducto} = require('../controlador/ProductoControler')
const upload = require('../../Utilidades/multer')
const { verificarToken } = require('../middleware');



ruta.get('/producto', ObtenerTodo)
ruta.get('/producto/:id', ObtenerPorID)
ruta.post('/producto', upload.single('imagen'), CrearUnProducto)

// Ejemplo de cómo deberían verse tus rutas protegidas
ruta.post("/add", verificarToken, CrearUnProducto);
ruta.put("/update", verificarToken,  ModificarProducto);
ruta.delete("/delete/:id", verificarToken, EliminarProducto);

//ruta.post('/productos', ()=>{
//    res.send(".")
//}

module.exports = ruta
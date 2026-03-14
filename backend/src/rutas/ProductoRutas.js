const express = require('express')
const ruta = express.Router()
const {ObtenerTodo, ObtenerPorID, CrearUnProducto, ModificarProducto, EliminarProducto} = require('../controlador/ProductoControler')
const upload = require('../../Utilidades/multer')
const { verificarToken } = require('../middleware');



ruta.get('/productos', ObtenerTodo)
ruta.get('/productos/:id', ObtenerPorID)
ruta.post('/productos', upload.single('imagen'), CrearUnProducto)


ruta.put("/update", verificarToken,  ModificarProducto);
ruta.delete("/delete/:id", verificarToken, EliminarProducto);

//ruta.post('/productos', ()=>{
//    res.send(".")
//}

module.exports = ruta
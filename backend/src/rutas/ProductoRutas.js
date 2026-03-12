const express = require('express')
const ruta = express.Router()
const {ObtenerTodo, ObtenerPorID, CrearUnProducto} = require('../controlador/ProductoControler')
const upload = require('../../Utilidades/multer')


ruta.get('/producto', ObtenerTodo)
ruta.get('/producto/:id', ObtenerPorID)
ruta.post('/producto', upload.single('imagen'), CrearUnProducto)

//ruta.post('/productos', ()=>{
//    res.send(".")
//})

module.exports = ruta
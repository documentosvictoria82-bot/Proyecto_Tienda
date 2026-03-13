const express = require('express')
const server = express();
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const ruta = require('./src/rutas/ProductoRutas')
const {conectar} = require('./src/config/indexconf')

const usuarioRuta = require('./src/rutas/usuariosRutas')



//const PORT = process.env.PORT || 3000
conectar()

server.use(express.json());
server.use(express.static(path.join (__dirname, 'public')))


server.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next()
    
})
//Crear carpeta para midleware, para tenerlos separados y después llamarlo. del 14 - 19
server.get('/', (req, res) =>{ 
res.send('API TIENDA')
})
    
server.use('/api', ruta)
server.use('/api', usuarioRuta)
// server.listen(PORT, ()=>{
//     console.log(`servidor corriendo en http://localhost:${PORT}`);
// })
module.exports = server;
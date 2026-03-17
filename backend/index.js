const express = require('express')
const server = express();
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const ruta = require('./src/rutas/ProductoRutas')
const {conectar} = require('./src/config/indexconf')
const cors = require('cors');

const usuarioRuta = require('./src/rutas/usuariosRutas')

server.use(cors());


const PORT = process.env.PORT || 3000
conectar()

server.use(express.json());
server.use(express.static(path.join (__dirname, '../Frontend')))

//guardar imagenes en carpeta uploads
server.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
console.log(path.join (__dirname, 'public'))


server.use('/api', ruta)
server.use('/api', usuarioRuta)
 server.listen(PORT, ()=>{
     console.log(`servidor corriendo en proyecto-tienda-rho.vercel.app`);
 })
     // Importas la función desde donde la tengas (ej. indexconf.js)
const { desconectar } = require('./src/config/indexconf'); 

// Escuchar cuando presionas Ctrl + C en la terminal
process.on('SIGINT', async () => {
    await desconectar();
    console.log("Servidor cerrado correctamente.");
    process.exit(0);
});

server.get("/", (req, res) =>{
        const indexpath = path.join(__dirname, "../Frontend/pages/index.html")
        res.sendFile(indexpath)
        // res.sendFile(path.join(publicPath, '../../public/index.html'))
        // res.sendFile(path.join(__dirname, "../public/index.html"))
        console.log("se muestra el archivo:", indexpath)
    })

module.exports = server;
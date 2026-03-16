const mongoose = require("mongoose")
// const { config } = require("dotenv")

//config()

const conectar = async () => {
    try {
console.log("Intentando conectar a:", process.env.MONGOURL);
        await mongoose.connect(process.env.MONGOURL)

        console.log("Conexión a la base de datos exitosa")

    } catch (error) {

        console.log("No se pudo conectar a la base de datos", error)

    }
}
const desconectar = async () => {
    try {
        await mongoose.disconnect();
        console.log("Desconexión de la base de datos exitosa");
    } catch (error) {
        console.log("Error al intentar desconectar", error);
    }    
}

module.exports = { conectar, desconectar }
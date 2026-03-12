const mongoose = require("mongoose")
const { config } = require("dotenv")

config()

const conectar = async () => {
    try {

        await mongoose.connect(process.env.MONGOURL)

        console.log("Conexión a la base de datos exitosa")

    } catch (error) {

        console.log("No se pudo conectar a la base de datos", error)

    }
}

module.exports = { conectar }
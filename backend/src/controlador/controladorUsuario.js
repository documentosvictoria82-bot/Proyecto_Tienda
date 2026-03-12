const User = require('../modelo/modeloUsuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// REGISTRO DE USUARIO
const register = async (req, res) => {

    try {

        const { usuario, email, password } = req.body

        // verificar si el usuario ya existe
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({
                error: "El usuario ya existe"
            })
        }

        // encriptar contraseña
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // crear usuario
        const newUser = new User({
            usuario,
            email,
            password: passwordHash
        })

        const savedUser = await newUser.save()

        res.status(201).json({
            message: "Usuario registrado correctamente",
            user: savedUser
        })

    } catch (error) {

        res.status(500).json({
            error: "Error al registrar usuario",
            details: error.message
        })

    }

}



// LOGIN
const login = async (req, res) => {

    try {

        const { email, password } = req.body

        // buscar usuario
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                error: "Usuario no encontrado"
            })
        }

        // comparar contraseña
        const passwordCorrect = await bcrypt.compare(password, user.password)

        if (!passwordCorrect) {
            return res.status(400).json({
                error: "Contraseña incorrecta"
            })
        }

        // generar token
        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            { expiresIn: "1h" }

        )

        res.status(200).json({
            message: "Login exitoso",
            token
        })

    } catch (error) {

        res.status(500).json({
            error: "Error en el login",
            details: error.message
        })

    }

}

module.exports = {
    register,
    login
}
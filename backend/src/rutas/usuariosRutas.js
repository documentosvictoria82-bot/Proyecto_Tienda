const express = require("express")
const router = express.Router()

const { register, login } = require("../controlador/controladorUsuario")

router.post("/register", register)

router.post("/login", login)

module.exports = router
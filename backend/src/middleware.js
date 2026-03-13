const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado, no hay token" });

    try {
        const verificado = jwt.verify(token, process.env.TOKEN_SECRET); // TOKEN_SECRET debe estar en tu .env
        req.user = verificado;
        next(); // ¡Todo bien, pasa al siguiente paso!
    } catch (error) {
        res.status(400).json({ mensaje: "Token no es válido" });
    }
};

module.exports = { verificarToken };
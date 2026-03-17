const multer = require('multer');
const path = require('path');   

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        // Asegúrate de que esta carpeta existe: backend/public/uploads/
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Extraemos la extensión del archivo original
        const ext = path.extname(file.originalname); 
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

module.exports = upload;
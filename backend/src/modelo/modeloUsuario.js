const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({

  usuario: { 
    type: String, 
    required: true, 
    unique: true 
    },

  email: { 
    type: String, 
    required: true, 
    unique: true 
    },

  password: { 
    type: String, 
    required: true 
    },

  role: { type: String, 
    default: 'user', 
    enum: ['user', 'admin'] 
    }, // Nuevo campo para el rol enum para que solo pueda ser user o admin
});

const User = mongoose.model("User", UserSchema)

module.exports = User
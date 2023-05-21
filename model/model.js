const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    username: {type: String, required: true, min: 3, max:20},
    password: {type: String, required:true, min: 5}
})

module.exports = new mongoose.model('Login', loginSchema);
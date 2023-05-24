const mongoose = require('mongoose')

const registerSchema = new mongoose.Schema({
    firstname:{type: String, required: true, min: 3, max:20},
    surname: {type: String, required: true, max:20},
    mobile_email:{
        type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Regular expression to check if value is a valid email or phone number
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^\d+$/;
        
        return emailRegex.test(value) || phoneRegex.test(value);
        }
      }
    },
    password:{type: String, required:true, min:5},
    dob:{type: Date, required:true},
    gender:{type: String, required: true},
});

module.exports = new mongoose.model('register', registerSchema);
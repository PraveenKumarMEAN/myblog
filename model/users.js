const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true })

module.exports = model('users', userSchema)
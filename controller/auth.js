const User = require('../model/users')
const Bcrypt = require('bcrypt')
const Joi = require('joi')
const JWT = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const register = async (req, res) => {

    try {
        const payload = req.body
        const schema = Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            dob: Joi.string().required(),
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })

        const { first_name, last_name, email, password, dob } = payload

        const oldUser = await User.findOne({ email })
        if (oldUser) return res.status(400).send({ message: 'Email Already Registred', success: false, data: {} })
        const encPassword = await Bcrypt.hash(password, 10)
        const userData = await User.create({
            first_name,
            last_name,
            email,
            password: encPassword,
            dob
        })
        let payloadData = {
            first_name,
            last_name,
            email,
            dob
        }
        return res.status(201).send({ message: 'User Registred', success: true, data: payloadData })


    } catch (error) {

    }
}




const login = async (req, res) => {
    try {
        const payload = req.body
        const schema = Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })

        const { email, password } = payload

        const oldUser = await User.findOne({ email })
        if (oldUser && await Bcrypt.compare(password, oldUser.password)) {
            let token = JWT.sign({ _id: oldUser._id, email, first_name: oldUser.first_name, last_name: oldUser.last_name, role:oldUser.role }, SECRET_KEY)
            let payloadData = {
                _id:oldUser._id,
                first_name: oldUser.first_name,
                last_name:oldUser.last_name,
                token
            }
            return res.status(200).send({ message: 'Login Successful', success: true, data: payloadData })
        } else {
            return res.status(400).send({ message: 'Incorrect Email or Password !', success: false, data: {} })
        }





    } catch (error) {

    }


}

module.exports = {
    register,
    login
}
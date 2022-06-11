const SECRET_KEY = process.env.SECRET_KEY
const JWT = require('jsonwebtoken')
const auth = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        if (!token) return res.status(401).send({ message: 'a token is required for authentication !' })
        const decoded = await JWT.verify(token, SECRET_KEY)
        if (!decoded) return res.status(401).send({ message: 'Invalid Token !' })
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).send({ message: error.message })
    }
}

module.exports = auth
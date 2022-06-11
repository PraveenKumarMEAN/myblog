const { Router } = require('express')
const { createCategory } = require('../controller/category')
const auth = require('../middleware/auth')

const categoryRouter = Router()

categoryRouter.post('/create', auth, createCategory)





module.exports = categoryRouter
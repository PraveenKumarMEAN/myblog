const express = require('express')
const authRouter = require('./routes/auth')
const blogRouter = require('./routes/blog')
const categoryRouter = require('./routes/category')
const app = express()
app.use(express.json())

app.use('/auth', authRouter)
app.use('/category', categoryRouter)
app.use('/blog', blogRouter)

module.exports = app
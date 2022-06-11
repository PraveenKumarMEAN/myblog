const { Router } = require('express')
const { createBlog, getAllBlog, updateBlog, deleteBlog } = require('../controller/post')
const auth = require('../middleware/auth')

const blogRouter = Router()

blogRouter.post('/create', auth, createBlog)
blogRouter.post('/getAllBlog', auth, getAllBlog)
blogRouter.post('/updateBlog', auth, updateBlog)
blogRouter.post('/deleteBlog', auth, deleteBlog)





module.exports = blogRouter
const Blog = require('../model/blogs')
const Joi = require('joi');
const { Types } = require('mongoose');
const Paginate = require('../common/pagination')
const createBlog = async (req, res) => {

    try {
        console.log(req.body);
        const payload = req.body
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            publised_date: Joi.string().required(),
            isPublished: Joi.boolean().required(),
            category: Joi.string().required(),
            start_date: Joi.string().required(),
            end_date: Joi.string().required(),
            recurrence: Joi.object().required()
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })
        const user = req.user
        const { title, description, publised_date, isPublished, category, start_date, end_date, recurrence } = payload
        const blogData = await Blog.create({
            title,
            description,
            publised_date,
            isPublished,
            category,
            start_date,
            end_date,
            user_id: user._id,
            recurrence
        })
        return res.status(201).send({ message: 'Blog Created', success: true, data: blogData })
    } catch (error) {
        return res.status(201).send({ message: error.message, success: false, data: {} })
    }


}



const getAllBlog = async (req, res) => {

    try {
        const payload = req.body
        const schema = Joi.object().keys({
            title: Joi.string().allow(""),
            category: Joi.string().allow(""),
            date: Joi.string().allow(""),
            recurrence: Joi.object().allow(),
            author: Joi.string().allow(""),
            page: Joi.number().allow(),
            limit: Joi.number().allow()
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })
        const user = req.user
        const { title, date, category, recurrence, author, page, limit } = payload
        let query = [
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user_id'
                }
            }, {
                '$lookup': {
                    'from': 'categories',
                    'localField': 'category',
                    'foreignField': '_id',
                    'as': 'category'
                }
            }, {
                '$unwind': {
                    'path': '$user_id',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unwind': {
                    'path': '$category',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unset': [
                    'user_id.password'
                ]
            }
        ]
        if (user.role == 'user') {
            query.push({
                '$match':
                    { 'user_id._id': Types.ObjectId(user._id) }
            })
        }
        if (author) {
            query.push({
                '$match': {
                    '$or': [
                        { 'user_id.first_name': { $regex: '.*' + author + '.*', $options: 'i' } },
                        { 'user_id.last_name': { $regex: '.*' + author + '.*', $options: 'i' } }
                    ]
                }
            })
        }

        if (title) {
            query.push({
                '$match':
                    { 'title': { $regex: '.*' + title + '.*', $options: 'i' } },
            })
        }

        if (category) {
            query.push({
                '$match':
                    { 'category.category_name': { $regex: '.*' + category + '.*', $options: 'i' } },
            })
        }

        if (date) {
            query.push({
                '$match':
                    { 'createdAt': { $regex: '.*' + date + '.*', $options: 'i' } },
            })
        }

        if (recurrence && recurrence.recurrence_repeat && recurrence.recurrence_repeat?.day) {
            query.push({
                '$match':
                    { 'recurrence.recurrence_repeat.day': { $regex: '.*' + recurrence.recurrence_repeat?.day + '.*', $options: 'i' } }
            })
        }

        if (recurrence && recurrence.recurrence_repeat && recurrence.recurrence_repeat?.every) {
            query.push({
                '$match':
                    { 'recurrence.recurrence_repeat.every': { $regex: '.*' + recurrence.recurrence_repeat?.every + '.*', $options: 'i' } }
            })
        }


        if (recurrence && recurrence.recurrence_repeat_on_the && recurrence.recurrence_repeat_on_the?.first) {
            query.push({
                '$match':
                    { 'recurrence.recurrence_repeat_on_the.first': { $regex: '.*' + recurrence.recurrence_repeat_on_the?.first + '.*', $options: 'i' } }

            })
        }

        if (recurrence && recurrence.recurrence_repeat_on_the && recurrence.recurrence_repeat_on_the?.day) {
            query.push({
                '$match':
                    { 'recurrence.recurrence_repeat_on_the.day': { $regex: '.*' + recurrence.recurrence_repeat_on_the?.day + '.*', $options: 'i' } }

            })
        }

        if (recurrence && recurrence.recurrence_repeat_on_the && recurrence.recurrence_repeat_on_the?.month) {
            query.push({
                '$match':
                    { 'recurrence.recurrence_repeat_on_the.month': { $regex: '.*' + recurrence.recurrence_repeat_on_the?.month + '.*', $options: 'i' } }

            })
        }
        const blogData = await Blog.aggregate(query)
        const paginatedItems = Paginate(blogData, page, limit)
        if (!paginatedItems.docs.length) return res.status(200).send({ message: 'Blog Not Found', success: true, data: paginatedItems })
        return res.status(200).send({ message: 'Success', success: true, data: paginatedItems })
    } catch (error) {
        return res.status(400).send({ message: error.message, success: false, data: {} })
    }


}




const updateBlog = async (req, res) => {

    try {
        const payload = req.body
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            publised_date: Joi.string().required(),
            isPublished: Joi.boolean().required(),
            category: Joi.string().required(),
            start_date: Joi.string().required(),
            end_date: Joi.string().required(),
            recurrence: Joi.object().required()
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })
        const user = req.user
        const { id, title, description, publised_date, isPublished, category, start_date, end_date, recurrence } = payload
        let query = {
            _id: id
        }
        if (user.role === 'user') {
            query.user_id = user._id
        }
        const blogData = await Blog.findOneAndUpdate(query, {
            title,
            description,
            publised_date,
            isPublished,
            category,
            start_date,
            end_date,
            recurrence
        }, { new: true })
        if (!blogData) return res.status(404).send({ message: 'Blog Not Found !', success: false, data: {} })
        return res.status(200).send({ message: 'Blog Updated', success: true, data: blogData })
    } catch (error) {
        return res.status(400).send({ message: error.message, success: false, data: {} })
    }


}



const deleteBlog = async (req, res) => {

    try {
        const payload = req.body
        const schema = Joi.object().keys({
            id: Joi.string().required(),
        })
        const result = schema.validate(payload)
        const { value, error } = result
        const valid = error == null
        if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })
        const user = req.user
        const { id } = payload
        let query = {
            _id: id
        }
        if (user.role === 'user') {
            query.user_id = user._id
        }
        const blogData = await Blog.findOneAndRemove(query)
        if (!blogData) return res.status(404).send({ message: 'Blog Not Found !', success: false, data: {} })
        return res.status(200).send({ message: 'Blog Deleted', success: true, data: blogData })
    } catch (error) {
        return res.status(400).send({ message: error.message, success: false, data: {} })
    }


}

module.exports = {
    createBlog,
    getAllBlog,
    updateBlog,
    deleteBlog
}
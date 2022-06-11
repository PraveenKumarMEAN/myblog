const Category = require('../model/category')
const Joi = require('joi')
const createCategory = async (req, res) => {

   try {
    console.log(req.body);
    const payload = req.body
    const schema = Joi.object().keys({
        category_name: Joi.string().required(),
    })
    const result = schema.validate(payload)
    const { value, error } = result
    const valid = error == null
    if (!valid) return res.status(400).send({ message: error.message, success: false, data: {} })
    const user = req.user
    const { category_name } = payload
    const categoryData = await Category.create({
        category_name,
        user_id:user._id
    })
    return res.status(201).send({ message: 'Category Created', success: true, data: categoryData })
   } catch (error) {
    return res.status(201).send({ message: error.message, success: false, data: {} })
   }


}

module.exports = {
    createCategory
}
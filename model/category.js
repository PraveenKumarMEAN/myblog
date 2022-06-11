const { Schema, model, Types } = require('mongoose')

const categorySchema = new Schema({
    category_name: { type: String, required: true },
    user_id: { type: Types.ObjectId, ref:'users', required: true },
}, { timestamps: true })

module.exports = model('categories', categorySchema)
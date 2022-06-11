const { Schema, model, Types } = require('mongoose')

const blogSchema = new Schema({
    user_id: { type: Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publised_date: { type: Date, default: null },
    isPublished: { type: Boolean, required: false },
    category: { type: Types.ObjectId, ref: 'categories', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    recurrence: {
        recurrence_repeat: {
            every: { type: String },
            day: { type: String },
        },
        recurrence_repeat_on_the: {
            first: { type: String },
            day: { type: String },
            month: { type: String },
        },
    }
}, { timestamps: true })

module.exports = model('blogs', blogSchema)
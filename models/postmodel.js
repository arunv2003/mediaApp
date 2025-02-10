const mongoose = require('mongoose')
const { type } = require('os')
const { title } = require('process')
const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    file: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

postSchema.add({
    comments: [
        {
            users: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',

            },
            text: {
                type: String,
            }
        }
    ],
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            red: 'user'
        }
    ]
})

module.exports = mongoose.model("posts", postSchema)
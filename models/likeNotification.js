const mongoose = require('mongoose')
const { type } = require('os')
const notificationSchema = mongoose.Schema({

    name: {
        type: String
    },
    profilePic: {
        type: String
    },
    message: {
        type: String
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    friendId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    read:{
        type:Boolean,
        default:false
    }

}
)
module.exports = mongoose.model('notification', notificationSchema)
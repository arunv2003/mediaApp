const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
    }
}, { timestamps: true })

messageSchema.add({
    file: {
        type:String
    }
})
module.exports = mongoose.model('message', messageSchema);


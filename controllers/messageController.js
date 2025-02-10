const Message = require('../models/Message')
const Conversation = require('../models/Conversation')

exports.messageSend = async (req, res) => {
    const { friendId } = req.params
    const userId = req.user
    const { text } = req.body
    const { file } = req.body

    try {
        let message = await Message.create({
            friendId,
            userId,
            text,
            file
        })
        let conversation = await Conversation.findOne({ members: { $all: [userId, friendId] } })
        if (!conversation) {
            conversation = await Conversation.create({ members: [userId, friendId] })
        }
        conversation.massages.push(message._id)
        await conversation.save()
        res.json({ msg: "message send successful", success: true })
    } catch (error) {
        res.json({ msg: "message failed", success: false, error: error.message })
    }
}

exports.getMessage = async (req, res) => {
    let userId = req.user
    let { friendId } = req.params

    let messages = await Conversation.findOne({ members: { $all: [userId, friendId] } }).populate('massages')
     if(!messages){
        messages={
            massages:[]
        }
     }
    res.json({ msg: "message get Successful", success: true, chat: messages.massages })


} 
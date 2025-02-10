const express=require('express')
const { messageSend, getMessage, getFriendUser } = require('../controllers/messageController')
const checkToken = require('../middleware/ckeckTocken')
const router=express.Router()


router.post('/sendMessage/:friendId',checkToken,messageSend)
router.get('/getMessage/:friendId',checkToken,getMessage)




module.exports=router
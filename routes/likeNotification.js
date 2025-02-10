const express=require('express')
const checkToken = require('../middleware/ckeckTocken')
const { notification, updateNotification } = require('../controllers/likeNotification')
const router=express.Router()

router.get('/getNotify',checkToken,notification)

router.put('/updateGetNotify/:_id',checkToken,updateNotification)

module.exports= router
const express=require('express');
const { createUser, loginUser, deleteUser, updateUser, forgotPassword, resetPassword, PasswordReset, getUserDetail, getUserByName, getUserBYId, follower } = require('../controllers/userConroller');
const checkToken = require('../middleware/ckeckTocken');

const router=express.Router();


router.post('/create',createUser)
router.post('/login',loginUser)
router.delete('/delete',checkToken,deleteUser)
router.put('/update/:_id',checkToken,updateUser)  ///_id is called proms ,id ke jagah pr jo data bhehte hai use proms kahte hai
router.post('/forgotPassword',forgotPassword)
router.get('/randomToken/:Token',resetPassword)
router.post('/resetToken/:Token',PasswordReset)
router.get('/userFound',checkToken,getUserDetail)
router.get('/getUser',getUserByName)
router.get('/getFriend/:_id',getUserBYId)
router.post('/follower/:_id',checkToken,follower)

module.exports=router 
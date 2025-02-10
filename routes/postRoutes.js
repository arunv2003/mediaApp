const express=require('express')
const { createPost, updatePost, deletePost, getAllPost, getYourPost, getFriendPost, commentsPost, deleteComment, likeDislike } = require('../controllers/postConroller')
const checkToken = require('../middleware/ckeckTocken')
const routes=express.Router()


routes.post("/create",checkToken,createPost)
routes.put("/update/:_id",updatePost)
routes.delete("/delete/:_id",deletePost)
routes.get("/allGet",getAllPost)
routes.get("/allYourPost",checkToken,getYourPost)
routes.get("/friendPost/:_id",getFriendPost)
routes.post("/comments/:postId",checkToken,commentsPost)
routes.delete("/deleteComment/:commentId/:postId",deleteComment )
routes.put("/likeDislike/:postId",checkToken,likeDislike )


module.exports=routes

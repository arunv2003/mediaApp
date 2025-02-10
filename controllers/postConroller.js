const path = require('path');
let PostCollection = require('../models/postmodel')



const createPost = async (req, res) => {
    let { title, description, file } = req.body;
    let _id = req.user
    try {
        let data = await PostCollection.create({
            title,
            description,
            file,
            userId: _id
        })
        // console.log(data)
        res.json({ msg: "post created successfully", success: true })
    } catch (error) {
        res.json({ msg: "error in creating post", success: false, error: error.message })
    }
}

const updatePost = async (req, res) => {
    let postId = req.params
    let { title, description } = req.body

    try {
        let post = await PostCollection.findByIdAndUpdate(postId, {
            title,
            description
        })
        res.json({ msg: "post update successful", success: true })
    } catch (error) {
        res.json({ msg: "post update failed", success: false ,error:error.message})
    }
}


const deletePost = async (req, res) => {
    let postId = req.params
    try {
        let post = await PostCollection.findByIdAndDelete(postId)
        res.json({ msg: "post delete successful", success: true })
    } catch (error) {
        res.json({ msg: "post delete failed", success: false, error: error.message })
    }
}

const getAllPost = async (req, res) => {
    try {
        let Posts = await PostCollection.find().sort({ createdAt: -1 }).populate({ path: "userId", select: "name profilePic" }).populate({
            path: "comments", populate: {
                path: "users", select: "name profilePic"
            }
        })
        //populate is ude for find some other thing 
        res.json({ msg: "All data get successfully", success: true, Posts })
    } catch (error) {
        res.json({ msg: "Network Error", success: false, error: error.message })
    }
}

const getYourPost = async (req, res) => {
    try {
        let userId = req.user
        let post = await PostCollection.find({ userId: userId }).sort({ createdAt: -1 })
        res.json({ msg: "post get Successful", success: true, post })
    } catch (error) {
        res.json({ msg: "network error", success: false, error: error.message })
    }

}

const getFriendPost = async (req, res) => {
    let id = req.params._id
    try {
        let posts = await PostCollection.find({ userId: id })
        res.json({ msg: "Post found successful", success: true, posts })
    } catch (error) {
        res.json({ msg: "Post not found successful", success: false, error: error.message })
    }
}

const commentsPost = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user
        const postId = req.params.postId
        let post = await PostCollection.findById(postId)
        post.comments.push({
            users: userId,
            text,
        })
        await post.save()
        res.json({ msg: "post comment successful", success: true })
    } catch (error) {
        res.json({ msg: "post comment failed", success: false, error: error.message })
    }
}

const deleteComment = async (req, res) => {
    let { commentId, postId } = req.params;
    // console.log(commentId)

    try {
        let post = await PostCollection.findById(postId)

        let filterCommentArr = post.comments.filter((comment) => comment._id.toString() !== commentId)

        post.comments = filterCommentArr

        //console.log("filterArr",filterCommentArr)
        await post.save()
        res.json({ msg: "Comment Deleted Successful", success: true })
    } catch (error) {
        res.json({ msg: "Comment is not Deleted try again later", success: false, error: error.message })
    }
}

const likeDislike = async (req, res) => {
    const postId = req.params.postId
    const userId = req.user

    try {
        let postFind = await PostCollection.findById(postId)
        if (!postFind.like.includes(userId)) {
            postFind.like.push(userId)
            await postFind.save()
            res.json({ msg: "Post like successful", success: true })
        }
        else {
            postFind.like.pull(userId)
            await postFind.save()
            res.json({ msg: "Post dislike successful", success: true })
        }
    } catch (error) {
        res.json({ msg: "check your network connection", success: false, error: error.message })
    }
}


module.exports = {
    createPost,
    updatePost,
    deletePost,
    getAllPost,
    getYourPost,
    getFriendPost,
    commentsPost,
    deleteComment,
    likeDislike,
}
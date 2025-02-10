const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
port = 5002
const cors = require('cors')
const LikeSchema=require('./models/likeNotification')


const connection = require('./db')
connection()

let userRouter = require('./routes/userRoutes')
let messageRouter = require('./routes/messageRoutes')
let postRouter = require('./routes/postRoutes')
let notificationRouter = require('./routes/likeNotification')

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.set('view engine', 'ejs')

let users = new Map()
const addUserData = (userId, socketId) => {
  users.set(userId, socketId)
 
}

io.on('connection', (socket) => {
  
  socket.on('addUser', (userId) => {
    
    addUserData(userId, socket.id)
  })
  socket.on('sendMessage', ({ userId, friendIdId, message }) => {
    // console.log({ userId, friendIdId, message })

    let findFriend = users.has(friendIdId)
    // console.log("friend", findFriend)
    let userSocket = users.get(friendIdId)
    // console.log("socket", userSocket)
    io.to(userSocket).emit('getMessage', { userId, friendIdId, message })
  })



  socket.on('likeNotification',async({postId,userId,Id,friendId})=>{
    // console.log("userID",userId)
    // console.log("postId",postId)
    // let postIds=users.has(postId)
    // console.log("friend",friendId)
    let userSocket = users.get(friendId)
    // console.log("socket", userSocket)
    io.to(userSocket).emit('getLikeNotification',{postId,friendId,userId,Id,message:'Like your Post'})
    if(friendId!==userId){
      let data=await LikeSchema.create({
        name:userId.name,
        profilePic:userId.profilePic,
        message:'Like your Post',
        userId:Id,
        postId, 
        friendId
       }) 
    }
  })

});





app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/message', messageRouter)
app.use('/api/notification',notificationRouter)







server.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
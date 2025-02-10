const mongoose = require('mongoose');


const connectToMongoDB=async()=>{
  try {
    //||'mongodb://127.0.0.1:27017/socialMediaApp'
    let data=await mongoose.connect(process.env.MONGO_URL)
    console.log('server is connected to mongo db')
  } catch (error) {
    console.log("server is not connected to mongodb")
  }
}
module.exports=connectToMongoDB;
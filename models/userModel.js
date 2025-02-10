const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
    minLength: 2,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },

});

userSchema.add({
  resetPasswordToken: {
    type: String,
    default: null,
  },
  profilePic: {
    type: String,
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg?w=768"
  },
  coverPic: {
    type: String,
    default: "https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D"
  },
  bio: {
    type: String
  },
  city: {
    type: String
  },
  follower: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }],
  following: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }]
})
// module.exports=mongoose.model(collectionName,structure)

module.exports = mongoose.model("user", userSchema);

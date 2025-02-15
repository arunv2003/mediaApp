const userCollection = require("../models/userModel");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
let JWT_SECRET = "krishna@gmail.com";

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.json({ msg: "name is required", success: false });
  }
  if (!email) {
    return res.json({ msg: "your email is required", success: false });
  }
  if (!password) {
    return res.json({ msg: "password is required", success: false });
  }
  //automatic save method

  let findUser = await userCollection.findOne({ email });
  // console.log(findUser);
  if (findUser) {
    return await res.json({ msg: "user already exist", success: false });
  }
  try {
    // const hash = bcrypt.hashSync("B4c0/\/", salt); //formate

    let hashPassword = bcrypt.hashSync(password, salt);
    // console.log(hashPassword)
    let data = await userCollection.create({
      name,
      email,
      password: hashPassword,
    });

    res.json({ msg: "user register successfully", success: true });
  } catch (error) {
    res.json({
      msg: "error in creating user ",
      success: false,
      error: error.message,
    });
  }

  //save method
  // let data= await new userCollection({
  //   name,email,password
  // })

  // await data.save()
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.json({ msg: "enter your registered email", success: false });
  }

  if (!password) {
    return res.json({ msg: "password is required", success: false });
  }
  let findUser = await userCollection.findOne({ email });
  // console.log(findUser);

  if (findUser) {
    let comparePassword = bcrypt.compareSync(password, findUser.password);
    if (comparePassword) {
      // var token = jwt.sign({ foo: 'bar' }, 'secreteKey');   // import for token banane ke liye

      let token = jwt.sign({ _id: findUser._id }, JWT_SECRET);

      res.json({ msg: "login successfully", success: true, token: token });
    } else {
      res.json({ msg: "wrong password", success: false });
    }
  } else {
    res.json({ msg: "user not found", success: false });
  }
};

const deleteUser = async (req, res) => {
  let id = req.user;
  // console.log("id", id);
  try {
    await userCollection.findByIdAndDelete(id);
    res.json({ msg: "user delete successful", success: true });
  } catch (error) {
    res.json({
      msg: "user delete failed",
      success: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  // res.send("update user function")

  const id = req.user;

  // console.log(id)

  if (id !== req.params._id) {
    return res.json({
      msg: "not authorized to update this account",
      success: false,
    });
  }

  // let data =await userCollection.updateOne({name:"abc"},{$set:{name:"xyz"}})  //update syntax  in mongodb

  let { name, password, profilePic, coverPic, bio, city } = req.body;
  
  try {
    if (password) {
      var hashPassword = bcrypt.hashSync(password, salt);
    }
    let data = await userCollection.findByIdAndUpdate(id, {
      name: name,
      password: hashPassword,
      profilePic,
      coverPic,
      bio,
      city
    });
    res.json({ msg: "user updated successful", success: true });
  } catch (error) {
    res.json({
      msg: "user updated failed",
      success: false,
      error:error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let userFind = await userCollection.findOne({ email });

    if (userFind) {
      let randomToken = randomstring.generate(40);
      // res.send(randomToken);
      userFind.resetPasswordToken = randomToken;
      await userFind.save();

      // let updateUser=await userCollection.findByIdAndUpdate(userFind._id,{resetPasswordToken:randomToken})

      const mail = await sendEmail(email, randomToken);
      res.json({
        msg: "Please check your email for password reset",
        success: true,
      });
    } else {
      res.json({ msg: "invalid email", success: false });
    }
  } catch (error) {
    res.json({
      msg: "error in forgot password",
      success: false,
      error: error.message
    })
  }
};

function sendEmail(email, randomToken) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "vermakumararun2003@gmail.com",
      pass: "cqcz ysxb rnta ouzu",
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "vermakumararun2003@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Password reset request ✔", // Subject line
      text: `Please chick the link below to choose new password:\n"https://mediaapp-i6ao.onrender.com/api/users/randomToken/${randomToken}"`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
}

const resetPassword = async (req, res) => {
  // res.send("hello")

  let token = req.params.Token
  // console.log(token)
  let user = await userCollection.findOne({ resetPasswordToken: token })
  if (user) {
    res.render('resetPassword', { token })
  }
  else {
    res.send("Token expire")
  }
}

const PasswordReset = async (req, res) => {
  let token = req.params.Token
  let newPassword = req.body.newPassword
  try {
    let user = await userCollection.findOne({ resetPasswordToken: token })

    if (user) {
      let hashPassword = bcrypt.hashSync(newPassword, salt)
      user.password = hashPassword
      user.resetPasswordToken = null
      await user.save()
      res.json({ msg: "password successfully update", success: true })
    }
    else {
      res.json({ msg: "token expire ", success: false })
    }

  } catch (error) {
    res.json({ msg: "Some technical issue please try again later", success: false, error: error.message })
  }
}

const getUserDetail = async (req, res) => {
  let userId = req.user
  // console.log(userId)
  try {
    let data = await userCollection.findById(userId)
    // console.log(data)
    res.json({ msg: "user found successful", success: true, data })
  } catch (error) {
    res.json({ msg: "user found false", success: false, error: error.message })
  }
}

const getUserByName = async (req, res) => {

  let name = req.query.q
  let query = new RegExp(name)
  if (req.query.q === "") {
    res.json([])
  }
  else {
    let data = await userCollection.find({ name: query })
    res.json(data)
  }
}

const getUserBYId = async (req, res) => {
  let id = req.params._id
  try {
    let friend = await userCollection.findById(id).select('-password')
    res.json({ msg: "User Found successful", success: true, friend })
  } catch (error) {
    res.json({ msg: "User not found successful", success: false, error: error.message })
  }
}

const follower = async (req, res) => {
  let userId = req.user;
  let friendId = req.params._id;
  let userDetail = await userCollection.findById(userId)
  let friendDetail = await userCollection.findById(friendId)
  // console.log(userDetail)
  if (!userDetail.following.includes(friendId)) {
    userDetail.following.push(friendId)
    friendDetail.follower.push(userId)
    await userDetail.save()
    await friendDetail.save()
    return res.json({ msg: "user Follow successful", success: true })
  }
  else {
    userDetail.following.pull(friendId)
    friendDetail.follower.pull(userId)
    await userDetail.save()
    await friendDetail.save()
    return res.json({ msg: "user UnFollow successful", success: false })
  }

}



module.exports = {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  PasswordReset,
  getUserDetail,
  getUserByName,
  getUserBYId,
  follower,
};

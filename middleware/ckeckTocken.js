//middleware ---> middleware is a functions that have a function of requesting to an object,responding to an object, (oR that have to access request  and response and can go to the  and go to the middleware function). they can modify request and response

let jwt = require("jsonwebtoken");
let JWT_SECRET = "krishna@gmail.com"; //my secret

const checkToken = (req, res, next) => {
  try {
    // res.json("I am middleware")
    // next()
    let token = req.headers.authorization;
    if (!token) {
      return res.json({ msg: "token note found", success: false });
    }
    // console.log(token);

    // let decoded = jwt.verify(token, 'secretKey');   //method user for decode

    let decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded._id);

    req.user = decoded._id;
    next();
  } catch (error) {
    return res.json({msg:"invalid token" ,success:false,error:error.message})
  }
};

module.exports = checkToken;

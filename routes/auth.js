const express = require("express");
const router = express.Router();
const User = require("../models/User")
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
//Register
router.post("/register", async(req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email:req.body.email,
        password: CryptoJs.AES.encrypt
        (req.body.password, process.env.CRYPTO_SECRET).toString(),
    });

  try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }catch(err){
      res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("User not found")
        

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.CRYPTO_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        originalPassword!== req.body.password &&
        res.status(401).json("Wrong password!");

        const accessToken = jwt.sign({
            id:user._id, 
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET, {expiresIn: "3d"})

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    }catch(err){
         
    }
})


module.exports = router;


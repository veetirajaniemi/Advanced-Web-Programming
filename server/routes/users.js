var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/register", (req, res, next) => {
  res.render("register")
})

router.post("/register", upload.none(),
  body("email").isEmail(),
  body("password").isStrongPassword(),
  async (req, res, next) => {
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        console.log("!")
        //let errorDiv = document.getElementById("registererror")
        return res.status(400).json({message: "Password is not strong enough"})
      }

        let user = await User.findOne({email: req.body.email})
        if (user) {
          return res.status(403).json({message: "Email already in use"})
        } else {
            bcrypt.genSalt(10, async (err, salt) => {
              bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) throw err;
                try {
                  let newUser = await new User({
                    email: req.body.email,
                    password: hash
                  })
                  await newUser.save()
                  res.json({info: "Registration ok"})
                  //res.redirect("/login.html")
                } catch(err) {
                  console.log(err)
                }
                
              })
            })
          }
        } catch(err) {
          console.log(err)
        }
      }
  )

router.get("/login", (req, res, next) => {
  res.render("login")
})


router.post("/login", upload.none(),
async (req, res, next) => {
  try {
    let user = await User.findOne({email: req.body.email})
    if (!user) {return res.status(403).json({message: "Invalid credentials"})
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const jwtPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token) => {
              res.json({success: true, token})
            }
          )
        } else {
          return res.status(403).json({message: "Invalid credentials"})
        }
      })
    }
  } catch(err) {
    console.log(err)
  }
})

module.exports = router;

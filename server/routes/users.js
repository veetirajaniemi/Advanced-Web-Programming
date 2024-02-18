var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");
const Chat = require("../models/Chat")
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

router.get("/:email", async (req, res, next) => {
  try {
    let email = req.params.email 
    console.log(email)
    let user = await User.findOne({email: req.params.email})
    console.log(user)
    return res.json({name: user.name})
  } catch(err) {
    console.log(err)
  }
})

router.get("/profile/:id", async (req, res, next) => {
  console.log("heiheihei")
  try {
    let id = req.params.id
    console.log(req.params.id)
    let user = await User.findOne({_id: id})
    console.log(user)
    return res.json({name: user.name, bio: user.bio})
  } catch(err) {
    console.log(err)
  }
})

router.post("/bio/:id", async (req, res, next) => {
  try {
    let id = req.params.id
    let user = await User.findOne({_id: id})
    user.bio = req.body.bio
    await user.save()
    res.json({info: "Your profile text was updated succesfully!"})
  } catch(err) {
    console.log(err)
  }
})

router.post("/register", upload.none(),
  body("email").isEmail(),
  body("password").isStrongPassword(),
  async (req, res, next) => {
    try{
      const errors = validationResult(req);
      if (!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({message: "Full name needs to be given!"})
      } else if (!req.body.email) {
        return res.status(400).json({message: "Give an email address!"})
      }
      if(!errors.isEmpty()) {
        console.log("!")
        //let errorDiv = document.getElementById("registererror")
        return res.status(400).json({message: "Password is not strong enough!"})
      }

        let user = await User.findOne({email: req.body.email})
        if (user) {
          return res.status(403).json({message: "Email already in use!"})
        } else {
            bcrypt.genSalt(10, async (err, salt) => {
              bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) throw err;
                try {
                  let newUser = await new User({
                    email: req.body.email,
                    password: hash,
                    name: req.body.firstname + " " + req.body.lastname,
                    bio: ""
                  })
                  await newUser.save()
                  res.json({info: "Registration complete!"})
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
    if (!user) {return res.status(403).json({message: "Invalid credentials!"})
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
          return res.status(403).json({message: "Invalid credentials!"})
        }
      })
    }
  } catch(err) {
    console.log(err)
  }
})

router.get("/browse/:id", async (req, res, next) => {
  try {
    let id = req.params.id
    let curUser = await User.findOne({_id: id})
    let users = await User.find({})

    for (let i = 0; i < users.length; i++) {
      let user = users[i]
      if (id == user._id || curUser.likes.includes(user._id) || curUser.dislikes.includes(user._id) || curUser.matches.includes(user._id)) {
        continue
      }
      console.log("CurUser id: " + id)
      console.log("User id: " + user._id)
      return res.json(user)
    }
    return res.json({message: "No more users left."})


  } catch(err) {
    console.log(err)
  }
})

router.post("/like", upload.none(), async(req, res, next) => {
  try {
    let whoLikes = await User.findById(req.body.liker)
    let whoIsLiked = await User.findById(req.body.liked)

    whoLikes.likes.push(req.body.liked)

    if (whoIsLiked.likes.includes(req.body.liker)) {
      whoLikes.matches.push(req.body.liked)
      whoIsLiked.matches.push(req.body.liker)
      await whoLikes.save()
      await whoIsLiked.save()
      return res.json({message: "It's a match!"})
    }

    await whoLikes.save()
    return res.json({message: "Not a match."})



  } catch(err) {
    console.log(err)
  }
})

router.post("/dislike", upload.none(), async(req, res, next) => {
  try {
    let whoDislikes = await User.findById(req.body.disliker)
    whoDislikes.dislikes.push(req.body.disliked)
    await whoDislikes.save()
    return res.json({message: "You disliked."})
  } catch (e) {
    console.log(e)
  }
})

// Getting a list of user's matches. User can chat to them. 
router.get("/getchat/:id", upload.none(), async(req, res, next) => {
  try {
    let user = await User.findById(req.params.id)
    //console.log("User: " + user)
    let matches = []
    //console.log("Matches: " + user.matches)
    for (let i = 0; i < user.matches.length; i++) {
      console.log("ID jolla etitään: " + user.matches[i])
      let match = await User.findById(user.matches[i])
      if (match) {
        let matchObj = {
          id: match._id,
          name: match.name
        }
        matches.push(matchObj)
      }
    }
    return res.json(matches)
  } catch(e) {
    console.log(e)
  }
})

router.get("/chat/:ids", upload.none(), async(req, res, next) => {
  try {
    let id = req.params.ids
    console.log(id)
    let ids = req.params.ids.split("+")
    let user1 = ids[0]
    let user2 = ids[1]

    let chat = await Chat.findOne(
      {"users": {"$all":[user1, user2]}}
    )

    if (chat) {
      console.log("on chätti")
      return res.json(chat.messages)
    } else {
      console.log("tehää chätti")
      let newChat = await new Chat({
        users: [user1, user2]
      })
      await newChat.save()
    }

    return res.json("ok")
  } catch(e) {
    console.log(e)
  }
})

router.post("/chat/:ids", upload.none(), async(req, res, next) => {
  try {
    let ids = req.params.ids.split("+")
    let user1 = ids[0]
    let user2 = ids[1]

    let chat = await Chat.findOne(
      {"users": {"$all":[user1, user2]}}
    )

    chat.messages.push({
      user: user1,
      msg: req.body.message,
      time: req.body.time
    })
    await chat.save()
    res.json({message: "ookoo"})

  } catch(e) {
    console.log(e)
  }
})




module.exports = router;

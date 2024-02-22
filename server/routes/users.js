var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");
const Chat = require("../models/Chat")
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage})



// Getting the current user's profile from database
router.get("/profile/:id", validateToken, async (req, res) => {
  try {
    let id = req.params.id
    let user = await User.findOne({_id: id})
    return res.json({name: user.name, bio: user.bio})
  } catch(err) {
    console.log(err)
  }
})

// Saving the new profile text to the database
router.post("/profile/:id", validateToken, async (req, res) => {
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

// Saving new user's info to the database
router.post("/register", upload.none(),
  body("email").isEmail(),
  body("password").isStrongPassword(),
  async (req, res) => {
    try{
      const errors = validationResult(req);
      if (!req.body.firstname || !req.body.lastname) {
        return res.status(400).json({message: "Full name needs to be given!"})
      } else if (!req.body.email) {
        return res.status(400).json({message: "Give an email address!"})
      }
      if(!errors.isEmpty()) {
        return res.status(400).json({message: "Password is not strong enough! You need at least a symbol, uppercase letter, lowercase letter and a number. Minimum length is 8."})
      }

        let user = await User.findOne({email: req.body.email})
        if (user) {
          return res.status(403).json({message: "Email already in use!"})
        } else { // Creating new user, hashing password
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


/* Creating the jsonwebtoken for user with correct credentials */
router.post("/login", upload.none(),
async (req, res, next) => {
  try {
    let user = await User.findOne({email: req.body.email})
    if (!user) {return res.status(403).json({message: "Invalid credentials!"})
    } else { // Comparing credentials
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const jwtPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign( // Creating the jwt token and http-only cookie with it
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 6000000 // 10 minutes
            },
            (err, token) => {
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 6000000 // 10 minutes
              })
              res.json({success: true, token}) // sending back the jwt token
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


/* Getting a new user from the database. */
router.get("/browse/:id", validateToken, async (req, res) => {
  try {
    let id = req.params.id
    let curUser = await User.findOne({_id: id})
    let users = await User.find({})

    for (let i = 0; i < users.length; i++) {
      let user = users[i]
      if (id == user._id || curUser.likes.includes(user._id) || curUser.dislikes.includes(user._id) || curUser.matches.includes(user._id)) {
        continue
      }
      return res.json(user)
    }
    return res.json({message: "No more users left."})


  } catch(err) {
    console.log(err)
  }
})


  /* Updates the like information to the user database and returns info 
    about possible match. */
router.post("/like", validateToken, upload.none(), async(req, res, next) => {
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

  /* Updates the dislike information to the user database. */
router.post("/dislike", validateToken, upload.none(), async(req, res, next) => {
  try {
    let whoDislikes = await User.findById(req.body.disliker)
    whoDislikes.dislikes.push(req.body.disliked)
    await whoDislikes.save()
    return res.json({message: "You disliked."})
  } catch (e) {
    console.log(e)
  }
})

// Getting a list of user's matches to chat with
router.get("/getchat/:id", validateToken, upload.none(), async(req, res, next) => {
  try {
    let user = await User.findById(req.params.id)
    let matches = []
  
    for (let i = 0; i < user.matches.length; i++) {
      let match = await User.findById(user.matches[i])
      if (match) { // Match found
        let matchObj = {
          id: match._id,
          name: match.name
        }
        matches.push(matchObj)
      }
    }
    return res.json(matches) // Returning name and id of each match
  } catch(e) {
    console.log(e)
  }
})

// Getting the correct chat from the database
router.get("/chat/:ids", validateToken, upload.none(), async(req, res) => {
  try {
    let ids = req.params.ids.split("+")
    let user1 = ids[0]
    let user2 = ids[1]

    let chat = await Chat.findOne( 
      {"users": {"$all":[user1, user2]}}
    )

    if (chat) { // returning found chat
      return res.json(chat.messages)
    } else { // creating new chat when one doesn't exist
      let newChat = await new Chat({
        users: [user1, user2]
      })
      await newChat.save()
    }
    return res.json({message: "New chat created"})
  } catch(e) {
    console.log(e)
  }
})

// Saving new chats to the database
router.post("/chat/:ids", validateToken, upload.none(), async(req, res, next) => {
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
    res.json({message: "Chat saved."})

  } catch(e) {
    console.log(e)
  }
})

/* Removes the http-only jwt cookie which was used when logging in. */
router.get("/logout", upload.none(), async(req, res) => {
  if (req.cookies.jwt) {
    let options = {
      httpOnly: true,
      maxAge: 0
    }
    res.clearCookie("jwt", options)
    res.end()
  }
})
  




module.exports = router;

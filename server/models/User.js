// Model to include Users' information

const mongoose = require("mongoose")
const Schema = mongoose.Schema

let userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    bio: String,
    likes: [String], // id's of liked, disliked and matched users
    dislikes: [String],
    matches: [String]
})

module.exports = mongoose.model("User", userSchema)
// Model to include chats between 2 users

const mongoose = require("mongoose")
const Schema = mongoose.Schema

let chatSchema = new Schema({
    users: [String], // user ids of the chat's users
    messages: [{
        user: String, // sender of message
        msg: String,
        time: String
    }]
})

module.exports = mongoose.model("Chat", chatSchema)
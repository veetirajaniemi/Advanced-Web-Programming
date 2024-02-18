const mongoose = require("mongoose")
const Schema = mongoose.Schema

let chatSchema = new Schema({
    users: [String],
    messages: [{
        user: String,
        msg: String,
        time: String
    }]
})

module.exports = mongoose.model("Chat", chatSchema)
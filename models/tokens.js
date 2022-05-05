const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    userID: String,
    userName: String,
    tokens: Number,
})
module.exports = mongoose.model('tokens', Schema)
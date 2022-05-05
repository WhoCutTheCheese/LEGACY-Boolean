  
const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guildID: String,
    guildName: String, 
    prefix: String,
    color: String,
    premium: Boolean,
    premiumHolder: String,
})

module.exports = mongoose.model('guild', Schema)
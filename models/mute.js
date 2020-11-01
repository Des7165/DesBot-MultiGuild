const mongoose = require("mongoose")

const mute = mongoose.Schema({
    guildID: String,
    memberID: String,
    length: Date,
    memberRole: Array,
})

module.exports = mongoose.model("mute" ,mute)
const {bot_token, mongo_url, prefix} = require('./config.json')
const Discord = require("discord.js")
const Client = new Discord.Client()
const mongoose = require('mongoose')
const fs = require("fs")

Client.commands = new Discord.Collection()

Client.login(bot_token)

const commandFiles = fs.readdirSync('./commands')
for (const file of commandFiles){
    const command = require(`./commands/${file}`)
    Client.commands.set(command.name, command)

}
Client.once("ready", () =>{
    console.log("Active")

    mongoose.connect(mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(console.log("mongo db connected"))

})

Client.on('message', message =>{
    if(!message.guild || message.author.bot || !message.content.startsWith(prefix)) return

    const args = message.content.substring(prefix.length).split(" ")
    const command = args.shift()

    const cmd = Client.commands.get(command)

    if(!cmd) return

    try{
        cmd.execute(message, args)
    }
    catch (error){
        console.log(error)
        message.channel.send("There seems to be an error while excecuting this command")
    }
})
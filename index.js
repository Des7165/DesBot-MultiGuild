const {bot_token, mongo_url} = require('./config.json')
const Discord = require("discord.js")
const client = new Discord.Client({partials: ['MESSAGE', 'REACTION', 'CHANNEL']})
const Client = new Discord.Client()
const mongoose = require('mongoose')
const fs = require("fs")
const prefix = require("./models/prefix");
Client.commands = new Discord.Collection()

Client.login(bot_token)

const commandFiles = fs.readdirSync('./commands')
for (const file of commandFiles){
    const command = require(`./commands/${file}`)
    Client.commands.set(command.name, command)

}


const muteModel = require("./models/mute")
Client.once("ready", () =>{
    console.log("Active")
    console.log(Client.commands)
    
    mongoose.connect(mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    }).then(console.log("mongo db connected"))
    setInterval(async() =>{
        
        for (const guild of Client.guilds.cache){
            const muteArray = await muteModel.find({
                guildID: guild[0],
            })
            
            for (const muteDoc of muteArray){
                if(Date.now() >= Number(muteDoc.length)){
                    const guild = Client.guilds.cache.get(muteDoc.guildID)
                    const member = guild ? guild.members.cache.get(muteDoc.memberID) : null
                    const muteRole = guild ? guild.roles.cache.find(r => r.name == "Muted") : null

                    if(member){
                        await member.roles.remove(muteRole ? muteRole.id : "").catch(err => console.log(err))
                        member.send(`you  have been unmuted from ${guild}`)
                        muteDoc.memberRole.forEach(async (role) => {
                                await member.roles.add(role).catch(err => console.log(err))
                             })
                    }

                    await muteDoc.deleteOne().catch(err => console.log(err))
                }
            }
        }
    }, 60000)
})

Client.on("guildMemberAdd", async member =>{
    const muteDoc = await muteModel.findOne({
        guildID: member.guild.id,
        memberID: member.id,

    })
    if(muteDoc){
        const muterole = member.guild.roles.cache.find(r => r.name == "Muted")

        if(muteRole)member.roles.add(muterole.id).catch(err => console.log(err))

        muteDoc.memberRoles = []

        await muteDoc.save().catch(err => console.log(err))
    }
})

Client.on('message', async (message) =>{
    if(!message.guild || message.author.bot ) return
    const data = await prefix.findOne({
        GuildID: message.guild.id
    });
    const messageArray = message.content.split(' ');
    const cmds = messageArray[0];
    const args = messageArray.slice(1);
    
 
    if(data) {
        const prefix = data.Prefix;
        if (!message.content.startsWith(prefix)) return;
        const cmd = Client.commands.get(cmds.slice(prefix.length)) || Client.commands.get(bot.aliases.get(cmds.slice(prefix.length))).catch(err => console.log(err))
        try{
            cmd.execute(message, args)
        }
        catch (error){
            console.log(error)
            message.channel.send("There seems to be an error while excecuting this command")
        }
        
    } else if (!data) {
        //set the default prefix here
        const prefix = "?";
        
        if (!message.content.startsWith(prefix)) return;

        const cmd = Client.commands.get(cmds.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmds.slice(prefix.length))).catch(err => console.log(err))
        try{
            cmd.execute(message, args)
        }
        catch (error){
            console.log(error)
            message.channel.send("There seems to be an error while excecuting this command")
        }
    }
   
    
    
    
    
    

    
})

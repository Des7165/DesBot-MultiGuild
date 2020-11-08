
const Discord = require("discord.js")
module.exports = {
    name: "say",
    description: "makes the bot say something",
    usage: "[embed] <text>",
    async execute(message,args){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("ONLY ADMINS CAN USE THIS COMMAND")
        if (message.deletable) message.delete()

        if (args.length < 1)
            return message.reply("Nothing to say").then(m => m.delete(5000))


        const roleColor = message.guild.me.displayHexColor
        if (args[0] === "embed") {
            console.log(args)

            const embed = new Discord.MessageEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
            message.channel.send(embed)
        }
        else{
            message.channel.send(args.slice(0).join(" "))
        }
    }
}
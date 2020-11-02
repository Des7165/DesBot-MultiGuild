const { Message } = require("discord.js")
const warnModel = require("../models/warn")

module.exports  = {
    name: "warnings",
    description: "View warnings of a member",
    usage: "<member>",

    async execute(message,args){
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        const warnDoc = await warnModel.findOne({
            guildID: message.guild.id,
            memberID: mentionedMember.id,
        })
        if(!warnDoc || !warnDoc.warnings.length){
            return message.channel.send(`${mentionedMember} doesn\'t have any warnings`)
        }

        const data = []

        for(let i = 0; warnDoc.warnings.length > i; i++){
            data.push(`**ID:** ${i + 1}`)
            data.push(`**Reason:** ${warnDoc.warnings[i]}`)
            data.push(`**Moderator:** ${await message.client.users.fetch(warnDoc.moderator[i]).catch(() => 'Deleted User')}`)
            data.push(`**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`)
        }

        const embed = {
            color: 'BLUE',
            thumbnail: {
                url: mentionedMember.user.displayAvatarURL({dynamic:true}),
            },
            description : data.join('\n')
        }

        message.channel.send({embed : embed})
    }
}
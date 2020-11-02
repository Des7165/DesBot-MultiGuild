const warnModel = require("../models/warn")
const { execute } = require("./invite")

module.exports = {
    name: "warn",
    description: "warns a members",
    usage: "<member> [reason]",
    async execute(message,args){
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if(!message.member.hasPermission("MANAGE_ROLES")){
            return message.channel.send("You don\'t have permission to warn members")
        }
        else if(!mentionedMember){
            return message.channel.send("You need to mention a member you want to warn")
        }

        const mentionedPosition = mentionedMember.roles.highest.posistion
        const memberPosition = message.member.roles.highest.posistion

        if(memberPosition <= mentionedPosition){
            return message.channel.send("You can\'t warn this member as their role is higher or equal to yours")
        }

        const reason = args.slice(1).join(" ") || "Not specified"

        let warnDoc = await warnModel.findOne({
            guildID: message.guild.id,
            memberID: mentionedMember.id,
        }).catch(err => console.log(err))

        if(!warnDoc){
            warnDoc = new warnModel({
                guildID: message.guild.id,
                memberID: mentionedMember.id,
                warnings: [reason],
                moderator: [message.member.id],
                date: [Date.now()],
            })
            await warnDoc.save().catch(err => console.log(err))
        }
        else{
            if(warnDoc.warnings.length >=3){
                return message.channel.send("You can\'t mute this member as they already have 3 warnings")
            }

            warnDoc.warnings.push(reason)
            warnDoc.moderator.push(message.member.id)
            warnDoc.date.push(Date.now())

            await warnDoc.save().catch(err => console.log(err))
        }

        message.channel.send(`Warned ${mentionedMember} for reason: **${reason}**`)
    }

    
    
}
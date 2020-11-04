const warnModel = require("../models/warn")
module.exports = {
    name:"unwarn",
    description: "unwarns a member in the server",
    usage: "<member> <warning id> [reason]",
    async execute(message,args){
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!message.member.hasPermission("MANAGE_ROLES")){
            return message.channel.send("You don\'t have permission to ru this commmnad")
        }
        else if(!mentionedMember){
            return messsage.channel.send("You need to mention a member you want to unmute")
        }

        const mentionedPosition = mentionedMember.roles.highest.position
        const memberPosition = message.member.roles.highest.position

        if(memberPosition <= mentionedPosition){
            return message.channel.send("You can\'t warn someone that is higher or equal to your role")
        }

        const reason = args.slice(2).join(" ")
        const warnDoc = await warnModel.findOne({
            guildID: message.guild.id,
            memberID: mentionedMember.id,
        }).catch(err => console.log(err))
        if(!warnDoc){
            return message.channel.send("This member doesn\'t have any warnings")
        }
         const warningsID = parseInt(args[1])
         if(warningsID <= 0 || warningsID > warnDoc.warnings.length){
             return message.channel.send("The warning ID is invalid")
         }

         warnDoc.warnings.splice(warningsID -1,warningsID !==1 ? warningsID -1:1)

         await warnDoc.save().catch(err => console.log(err))

         message.channel.send(`Unwarned ${mentionedMember} ${reason ? `for **${reason}**` : ``}`)

    }
}
const muteModel = require("../models/mute")
const ms = require("ms")
module.exports = {
    name: "mute",
    description: "mute a member in a server",
    usage: "<member> <time> [reason]",
    async execute(message, args){
        
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const msRegex = RegExp(/(\d+(s|m|h|w))/)
        let muteRole = message.guild.roles.cache.find(r => r.name == "Muted")

        if(!message.member.hasPermission("MANAGE_ROLES")){
            return message.channel.send("You don\'t have permission to mute members")
        }
        else if(!message.guild.me.hasPermission(["MANAGE_ROLES", "MANAGE_CHANNELS"])){
            return message.channel.send("I don\'t have **MANAGE_ROLES** and/or **MANAGE_CHANNELS** permissions")
        }
        else if(!mentionedMember){
            return message.channel.send("You need to mention a member you want to mute")
        }
        else if(!msRegex.test(args[1])){
            return message.channel.send("That is not a valid time to mute a member")
        }
        if(!muteRole){
            muteRole = await message.guild.roles.create({
                date:{
                    name:"Muted",
                    color:"BLACK",
                }
            }).catch(err => console.log(err))
        }
        if(mentionedMember.roles.highest.position >= message.guild.me.roles.highest.position){
            return message.channel.send("I can\'t mute this member as their role is higher/equal to mine")
        }
        else if(muteRole.position >= message.guild.me.roles.highest.position){
            return message.channel.send("I can\'t mute this member as the 'Muted' role is higher or equal to mine")
        }
        else if(ms(msRegex.exec(args[1])[1]) > 2592000000) {
            return message.channel.send("You can\'t mute a member for more than a month")
        }

        const isMuted = await muteModel.findOne({
            guildI: message.guild.id,
            memberID: mentionedMember.id
        })
        if (isMuted){
            return message.channel.send("This member is already muted!")
        }


        for( const channel of message.guild.channels.cache){
            channel[1].updateOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
            }).catch(err => console.log(err))
        }
        const noEveryone = mentionedMember.roles.cache.filter(r => r.name !== "@everyone")
        
        await mentionedMember.roles.add(muteRole.id).catch(err => console.log(err))

        for(const role of noEveryone){
            await mentionedMember.roles.remove(role[0]).catch(err => console.log(err))
        }

        const muteDoc= new muteModel({
            guildID: message.guild.id,
            memberID: mentionedMember.id,
            length: Date.now() + ms(msRegex.exec(args[1])[1]),
            memberRoles: noEveryone.map(r => r),
        })

        await muteDoc.save().catch(err => console.log(err))

        const reason = args.slice(2).join(" ")

        message.channel.send(`Muted ${mentionedMember} for **${msRegex.exec(args[1])[1]}** ${reason ? `for **${reason}**` : ''}`)
    }
}
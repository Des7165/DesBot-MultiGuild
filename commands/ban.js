module.exports = {
    name: "ban",
    description: "bans a user!",
    usage: "<member> reason",
    async execute(message, args){
        const menitonedMember = message.mentions.members.first()  || message.guild.members.cache.get(args[0])
        if(!message.member.hasPermission("BAN_MEMBERS")){
            return message.channel.send("You don\'t have permission to ban")
        }
        else if(!message.guild.me.hasPermission("BAN_MEMBERS")){
            return message.channel.send("I don\'t have permission to ban")
        }
        else if(!menitonedMember){
            return message.channel.send("You need to mention a member to ban")
        }

        const mentionedPosition = menitonedMember.roles.highest.position
        const memberPosition = message.member.roles.highest.permission
        const botPosition= message.guild.me.roles.highest.position

        if(memberPosition <= mentionedPosition){
            return message.channel.send("You can\'t ban this member because their roles is higher or equal to yours")
        }
        else if(botPosition <= mentionedPosition){
            return message.channel.send("I can\'t ban this member as their role is higher than mine")
        }
        const reason = args.slice(1).join(" ")
         try{
             message.guild.members.ban(menitonedMember, {reason: reason})
            
             message.channel.send(`Banned ${menitonedMember} for **${reason}** `)
         }
         catch (error){
             console.log(error)
             message.channel.send("There was an error banning this member")
         }
    }
}
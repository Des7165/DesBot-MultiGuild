const discord= require("discord.js")
const client = new discord.Client()
module.exports = {
    name: "nuke",
    description: "nukes a channel",

    execute(message, args) {
        let categoryId = message.channel.parentID
        let position = message.channel.rawPosition
        const chanName = message.channel.name;
        const catego = message.guild.channels.cache.find(c => c.id == categoryId && c.type == "category")
        message.channel.delete().catch(err => console.log(err))
        const chan = message.guild.channels.create(chanName, {
          type: 'text',
          parent: catego,
          position
        })
          .then(channel =>
            channel.send(`Succesfully nuked \`${chanName}\`\nhttps://imgur.com/LIyGeCR`)
          )
        
       
    }
}
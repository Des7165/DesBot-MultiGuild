module.exports = {
    name: "invite",
    description: "dms you the invite link for desbot guilds",
    execute(message, args){
        message.react("✅")
        message.author.send(`Invite me to your server using this link!
        https://discord.com/api/oauth2/authorize?client_id=772503766339420221&permissions=8&scope=bot`)
    }
}
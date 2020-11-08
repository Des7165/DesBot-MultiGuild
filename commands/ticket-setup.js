

module.exports = {
    name: "ticket-setup",
    description: "sets a ticket service in a channel",
    usage: "<channel>",

    async execute(message, args){
        const prefix = "?"
        if(!message.content.startsWith(prefix)){
            message.channel.send("Unfortunately, this is one of the few commands where it doesn't have a prefix you have set it \n the command for this will always be ?ticket-setup ")
        }
    }
}
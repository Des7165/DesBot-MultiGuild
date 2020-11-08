const { Client, MessageAttachment } = require('discord.js');

module.exports = {
    name: "pfp",
    description: "sends pfp of target",
    usage: "[user]",

    execute(message, args) {
        const { member, mentions } = message
        const tag = `<@${member.id}>`
        const target = mentions.users.first()

        if (!target) {
            const attachment = new MessageAttachment(message.author.displayAvatarURL({ dynamic: true }));

            message.channel.send(`${message.author.username}'s avatar:`);
            message.channel.send(attachment)
        }
        else {
            const attachment = new MessageAttachment(target.displayAvatarURL({ dynamic: true }));

            message.channel.send(`${target.username}'s avatar:`);
            message.channel.send(attachment)
        }


    }
}
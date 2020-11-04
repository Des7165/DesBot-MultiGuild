const Discord = require("discord.js")
const covid = require("novelcovid")

module.exports = {
    name: "covid",
    description: "shows covid 19 stats",
    
    async execute(message, args){
        const covidStats =  await covid.all()

        embed = new Discord.MessageEmbed()
            embed.setTitle('Covid 19 Stats')
            embed.setColor('RED')
            embed.addFields(
                {name: `Cases `, value: covidStats.cases.toLocaleString(), inline: true},
                {name: `Cases Today`, value: covidStats.todayCases.toLocaleString(), inline: true},
                {name: `Deaths`, value: covidStats.deaths.toLocaleString(), inline: true},
                {name: `Deaths Today`, value:covidStats.todayDeaths.toLocaleString(), inline: true},
                {name: `Recovered`, value: covidStats.recovered.toLocaleString(), inline:true},
                {name: `Recovered Today`, value: covidStats.todayRecovered.toLocaleString(), inline:true},
                {name: `Infected Right Now`, value: covidStats.active.toLocaleString(), inline: true},
                {name: `Critical Condition`, value: covidStats.critical.toLocaleString(), inline: true},
                {name: `Tested`, value: covidStats.tests.toLocaleString(), inline: true},
            )
        return message.channel.send(embed)
                    
                    
                    
    }
}
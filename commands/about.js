module.exports.run = async (message, args, parameter) => {
    const { MessageEmbed } = require('discord.js');
    let aboutEmbed = new MessageEmbed()
    .setTitle("Precipitation " + version.external)
    .setDescription('Hybrid moderation-fun bot')
    .addFields(
        { name: "Credits", value: "**raina#7847** - bot developer\n**arcelo#8442** - bug finder" },
    )
    .setColor("BLUE")
    .setFooter({ text: 'Precipitation ' + version.external });
    return message.channel.send({embeds: [aboutEmbed]});
}

module.exports.help = {
    name: "about",
    desc: "Gives information on the bot, as well as credits.",
    args: "",
    parameters: "",
    category: "General",
    version: "1.0.0"
}

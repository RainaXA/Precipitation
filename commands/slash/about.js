const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Gives information and credits, as well as the current version support for the bot.'),
    async execute(interaction) {
        let aboutEmbed = new MessageEmbed()
        .setTitle("Precipitation " + version.external)
        .setDescription('Hybrid moderation-fun bot')
        .addFields(
            { name: "Credits", value: "**raina#7847** - bot developer\n**arcelo#8442** - bug finder" },
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version.external });
        interaction.reply({ embeds: [aboutEmbed] })
    }
};

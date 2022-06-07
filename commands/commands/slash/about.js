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
            { name: "Next Release", value: "June 15th, 2022 (1.1)\nSeptember 1st, 2022 (2.0)" }, // not counting updates to this field as being a version change
            { name: "Links", value: "[GitHub](https://www.github.com/RainaXA/Precipitation)\n[Support Server](https://discord.gg/bSx5e434ub)\n[Invite to your own server](https://discord.com/api/oauth2/authorize?client_id=322397835716853771&permissions=8&scope=applications.commands%20bot)" }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version.external });
        interaction.reply({ embeds: [aboutEmbed] })
    }
};

const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

var releases = require("../data/releases.json")

var embed;
client.on('ready', async() => {
    embed = new MessageEmbed()
    embed.setTitle("Precipitation " + host.version.external)
    embed.setDescription('General-purpose Discord bot')
    embed.addFields(
        { name: "Credits", value: "**raina#7847** - bot developer\n**dr thargoide#8442** - bug finder\n**OwaHai#0645** - hosting the bot!" },
        { name: "Next Release", value: releases["stable"] },
        { name: "Links", value: "[GitHub](https://www.github.com/RainaXA/Precipitation)\n[Support Server](https://discord.gg/kasmyXa)\n[Invite Precipitation](https://discord.com/api/oauth2/authorize?client_id=322397835716853771&permissions=8&scope=applications.commands%20bot)" }
    )
    embed.setColor(host.color)
    embed.setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
})

var command = {
    name: "about",
    desc: "Gives information on the bot, as well as credits.",
    args: "",
    parameters: "",
    execute: {
        discord: function(message) {
            message.channel.send({embeds: [embed]});
        },
        slash: async function (interaction) {
            await interaction.reply({embeds: [embed]});
        },
        console: function() {
            log("Precipitation " + host.version.external + " - a discord bot brought upon us", logging.output, "about")
        }
    },
    ver: "3.0.0",
    cat: "General",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc)
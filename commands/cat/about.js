const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

var releases = require("../../data/releases.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Gives information on the bot, as well as credits.'),
};

var embed = new MessageEmbed()
module.exports.prereq = async(type, uni) => {
  embed = new MessageEmbed()
  embed.setTitle("Precipitation " + host.version.external)
  embed.setDescription('Hybrid moderation-fun bOwOt! Meow!')
  embed.addFields(
      { name: "Credits :3", value: "**raina#7847** - cat developer\n**arcelo#8442** - purr purr" },
      { name: "Next Release o3o", value: releases["stable"] },
      { name: "Links OwO", value: "[GitHub](https://www.github.com/RainaXA/Precipitation)\n[Support Server](https://discord.gg/bSx5e434ub)\n[Invite Precipitation](https://discord.com/api/oauth2/authorize?client_id=322397835716853771&permissions=8&scope=applications.commands%20bot) ([Roll](https://discord.com/api/oauth2/authorize?client_id=982907885535236118&permissions=8&scope=applications.commands%20bot) | [Bleed](https://discord.com/api/oauth2/authorize?client_id=982908116163260416&permissions=8&scope=bot%20applications.commands))" }
  )
  embed.setColor(host.colors[branch])
  embed.setFooter({ text: "Kitty " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
}

module.exports.default = async (message, args, parameter) => {
  message.channel.send({embeds: [embed]});
}

module.exports.slash = async (interaction) => {
  await interaction.reply({embeds: [embed]});
}

module.exports.console = async (args) => {
  log("Hello!", logging.output)
}

module.exports.help = {
    name: "about",
    desc: "Gives information on the bot, as well as credits.",
    args: "",
    parameters: "",
    category: "General",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": true
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true
}
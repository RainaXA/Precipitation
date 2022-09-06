const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

var logs = require("../data/changelogs.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Shows the current bot version.'),
};

module.exports.default = async (message, args, parameter) => {
  if(parameter.toLowerCase() == "show-internal") return message.channel.send("Precipitation " + host.version.internal)
  if(args) {
    let changelog = logs.numerical[args]
    if(!changelog) changelog = logs.versionName[args.toLowerCase()]
    if(!changelog) return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
    if(changelog == logs.versionName[args.toLowerCase()]) {
      let embed = new MessageEmbed()
      .setTitle(changelog.name)
      .setColor(host.colors[branch])
      .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
      for(change in changelog.changes) {
        embed.addField(change, changelog.changes[change])
      }
      return message.channel.send({embeds:[embed]});
    } else {
      let embed = new MessageEmbed()
      .setTitle(changelog.name)
      .addField("Changes", changelog.changes)
      .setColor(host.colors[branch])
      .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
      return message.channel.send({embeds:[embed]});
    }
  }
  return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
}

module.exports.slash = async (interaction) => {
  await interaction.reply({ content: "Precipitation " + host.version.external + " " + host.version.name + " (" + host.version.internal + ")" })
}

module.exports.console = async (args) => {
  log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output)
}

module.exports.help = {
    name: "version",
    alias: "ver",
    desc: "Shows the current bot version.",
    args: "(version)",
    parameters: "[--show-internal]",
    category: "General",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": true,
      "console": true
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true
}

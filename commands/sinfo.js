const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sinfo')
        .setDescription('Get information on the server.'),
};

module.exports.default = async (message, args, parameter) => {
  let embed = new MessageEmbed()
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
  .addField("Dates", "**Created**: " + message.guild.createdAt.toUTCString() + "\n**Precipitation Joined**: " + message.guild.joinedAt.toUTCString())
  .addField("Members", "**Member Count**: " + message.guild.memberCount + "\n**Server Owner**: <@" + message.guild.ownerId + ">")
  .addField("Misc.", "**Boosts:** " + message.guild.premiumSubscriptionCount)
  .setColor(host.colors[branch])
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  message.channel.send({embeds: [embed]})
}

module.exports.slash = async (interaction) => {
  let embed = new MessageEmbed()
  .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
  .addField("Dates", "**Created**: " + interaction.guild.createdAt.toUTCString() + "\n**Precipitation Joined**: " + interaction.guild.joinedAt.toUTCString())
  .addField("Members", "**Member Count**: " + interaction.guild.memberCount + "\n**Server Owner**: <@" + interaction.guild.ownerId + ">")
  .addField("Misc.", "**Boosts:** " + interaction.guild.premiumSubscriptionCount)
  .setColor(host.colors[branch])
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  await interaction.reply({embeds: [embed]})
}

module.exports.help = {
    name: "sinfo",
    desc: "Get information on the server.",
    args: "",
    parameters: "",
    category: "General",
}

module.exports.metadata = {
    allowDM: false,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": true,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

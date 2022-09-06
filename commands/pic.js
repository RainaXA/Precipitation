const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
  var find = require('./find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will only show message author.", logging.warn, "PIC")
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pic')
        .setDescription('Gets the profile picture of a user.')
        .addUserOption(user =>
        user.setName('user')
        .setDescription("Who to get the profile picture of")),
};

module.exports.default = async (message, args, parameter) => {
  let user;
  if(args && find) user = find(args.toLowerCase(), 1);
  if(!user) user = message.author
  let embed = new MessageEmbed()
  .setTitle(user.tag + "'s Profile Picture")
  .setImage(user.displayAvatarURL())
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  .setColor(host.colors[branch])
  message.channel.send({embeds: [embed]})
}

module.exports.slash = async (interaction) => {
  let user = interaction.options.getUser('user');
  if(!user) user = interaction.user;
  let embed = new MessageEmbed()
  .setTitle(user.tag + "'s Profile Picture")
  .setImage(user.displayAvatarURL())
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  .setColor(host.colors[branch])
  await interaction.reply({ embeds: [embed] })
}

module.exports.help = {
    name: "pic",
    desc: "Gets the profile picture of a user.",
    args: "(user)",
    parameters: "",
    category: "General",
}

module.exports.metadata = {
    allowDM: true,
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

const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
  var find = require('./find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will only show warnings of message author.", logging.warn, "LSWARN")
}

try {
  var name = require('./name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "WARN")
  function name(user) {
    return user.username;
  }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lswarn')
        .setDescription('See your current warnings, or see someone else\'s.')
        .addUserOption(option =>
          option.setName('user')
          .setDescription('The user to see warnings of [requires Manage Nicknames]')
          .setRequired(false)),
};

module.exports.default = async (message, args, parameter) => {
  let user;
  let mUser;
  if(args && find) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return message.channel.send("You do not have permission to view another user's warnings.")
    user = find(args.toLowerCase(), 1)
    if(!user) return message.channel.send("Couldn't find a user by that name.")
    message.guild.members.cache.each(member => {
      if(user.id == member.id) {
        return mUser = member;
      }
    })
    if(!config.users[user.id]) config.users[user.id] = {};
    if(!config.guilds[message.guild.id].warnings[user.id]) config.guilds[message.guild.id].warnings[user.id] = [];
    let warnings = config.guilds[message.guild.id].warnings[user.id];
    if(warnings.length == 0) return message.channel.send(user.username + " (" + name(user) + ") appears to have no warnings.")
    let warningEmbed = new MessageEmbed()
    .setTitle("Warnings List for " + user.tag)
    .setColor(host.colors[branch])
    .setFooter({ text: 'Precipitation ' + host.version.external })
    for(let i = 0; i < warnings.length; i++) {
      warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
    }
    return message.channel.send({embeds: [warningEmbed]})
  } else {
    if(!config.users[message.author.id]) config.users[message.author.id] = {};
    if(!config.guilds[message.guild.id].warnings[message.author.id]) config.guilds[message.guild.id].warnings[message.author.id] = [];
    let warnings = config.guilds[message.guild.id].warnings[message.author.id];
    if(warnings.length == 0) return message.channel.send("You appear to have no warnings.")
    let warningEmbed = new MessageEmbed()
    .setTitle("Warnings List for " + message.author.tag)
    .setColor(host.colors[branch])
    .setFooter({ text: 'Precipitation ' + host.version.external })
    for(let i = 0; i < warnings.length; i++) {
      warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
    }
    return message.channel.send({embeds: [warningEmbed]})
  }
}

module.exports.slash = async (interaction) => {
  let user = interaction.options.getUser('user');
  if(!user) {
    if(!config.users[interaction.user.id]) config.users[interaction.user.id] = {};
    if(!config.guilds[interaction.guild.id].warnings[interaction.user.id]) config.guilds[interaction.guild.id].warnings[interaction.user.id] = [];
    var warnings = config.guilds[interaction.guild.id].warnings[interaction.user.id];
    if(warnings.length == 0) return interaction.reply({ content: "You appear to have no warnings.", ephermeral: true })
    user = interaction.user;
  } else {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return interaction.reply({ content: "You do not have permission to view another user's warnings.", ephemeral: true })
    if(!config.users[user.id]) config.users[user.id] = {};
    if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
    var warnings = config.guilds[interaction.guild.id].warnings[user.id];
    if(warnings.length == 0) return interaction.reply({ content: user.username + " (" + name(user) + ") appears to have no warnings.", ephermeral: true })
  }
  let warningEmbed = new MessageEmbed()
  .setTitle("Warnings List for " + user.tag)
  .setColor(host.colors[branch])
  .setFooter({ text: 'Precipitation ' + host.version.external })
  for(let i = 0; i < warnings.length; i++) {
    warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
  }
  return interaction.reply({embeds: [warningEmbed]})
}

module.exports.help = {
    name: "lswarn",
    desc: "See your current warnings, or see someone else's.",
    args: "(user)",
    parameters: "",
    category: "Moderation",
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

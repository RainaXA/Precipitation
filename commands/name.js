const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

function name(user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('Sets the name for the bot to refer to you as.')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Set the name for the bot to refer to you as.')
            .setRequired(false)),
};

module.exports.name = name; // export function

module.exports.prereq = async(type, uni) => {
  if(type == types.default) {
    if(!config.users[uni.author.id]) config.users[uni.author.id] = {}; // curse you, message.author!!
  }
  if(type == types.slash) {
    if(!config.users[uni.user.id]) config.users[uni.user.id] = {};
  }
}

module.exports.default = async (message, args, parameter) => {
  if(args.length >= 75) return message.channel.send("That's too long of a name.")
  if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("I won't ping anyone.")
  if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
  if(args == "") {
    config.users[message.author.id].name = null;
    return message.channel.send("Sure, I'll refer to you by your username.")
  }
  config.users[message.author.id].name = args;
  return message.channel.send("Sure, I'll refer to you by \"" + args + "\".")
}

module.exports.slash = async (interaction) => {
  let arg = interaction.options.getString('name');
  if(!arg) {
      config.users[interaction.user.id].name = null;
      interaction.reply({ content: "Sure, I'll refer to you by your username." });
  } else {
      if(arg.length >= 75) return interaction.reply({ content: "That's too long of a name.", ephemeral: true })
      if((arg.includes("<@") && arg.includes(">")) || arg.includes("@everyone") || arg.includes("@here")) return interaction.reply({ content: "I won't ping anyone.", ephemeral: true })
      if(getTextInput(arg, host.slurs)) return interaction.reply({ content: "Hey, I'm not going to yell out offensive words.", ephemeral: true })
      config.users[interaction.user.id].name = arg;
      return interaction.reply({ content: "Sure, I'll refer to you by \"" + name(interaction.user) + "\"." })
  }
}

module.exports.help = {
    name: "name",
    desc: "Sets the name for the bot to refer to you as.",
    args: "(name)",
    parameters: "",
    category: "Personalization",
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
    unloadable: true
}

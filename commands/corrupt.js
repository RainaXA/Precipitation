const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('corrupt')
        .setDescription('Completely mess up a phrase.')
        .addStringOption(option =>
          option.setName('phrase')
          .setDescription('The phrase to corrupt')
          .setRequired(true)),
};

module.exports.default = async (message, args, parameter) => {
  let corrupted = args.toLowerCase().replace("a", args).replace("b", args).replace("c", args).replace("d", args).replace("e", args).replace("f", args).replace("g", args).replace("h", args).replace("i", args).replace("j", args).replace("k", args).replace("l", args).replace("m", args).replace("n", args).replace("o", args).replace("p", args).replace("q", args).replace("r", args).replace("s", args).replace("t", args).replace("u", args).replace("v", args).replace("w", args).replace("x", args).replace("y", args).replace("z", args)
  if(corrupted.length >= 1024) return message.channel.send("Sorry! The result is way too long. Please shorten it.")
  let embed = new MessageEmbed()
  .setTitle("Corruption Results")
  .addField("Original", "```\n" + args + "\n```")
  .addField("New", "```\n" + corrupted + "\n```")
  .setColor(host.colors[branch])
  message.channel.send({embeds: [embed]})
}

module.exports.slash = async (interaction) => {
  let args = interaction.options.getString('phrase') // ctrl+c, ctrl+v
  let corrupted = args.toLowerCase().replace("a", args).replace("b", args).replace("c", args).replace("d", args).replace("e", args).replace("f", args).replace("g", args).replace("h", args).replace("i", args).replace("j", args).replace("k", args).replace("l", args).replace("m", args).replace("n", args).replace("o", args).replace("p", args).replace("q", args).replace("r", args).replace("s", args).replace("t", args).replace("u", args).replace("v", args).replace("w", args).replace("x", args).replace("y", args).replace("z", args)
  if(corrupted.length >= 1024) return message.channel.send("Sorry! The result is way too long. Please shorten it.")
  let embed = new MessageEmbed()
  .setTitle("Corruption Results")
  .addField("Original", "```\n" + args + "\n```")
  .addField("New", "```\n" + corrupted + "\n```")
  .setColor(host.colors[branch])
  interaction.reply({embeds: [embed]})
}

module.exports.console = async (args) => {
  log(args.toLowerCase().replace("a", args).replace("b", args).replace("c", args).replace("d", args).replace("e", args).replace("f", args).replace("g", args).replace("h", args).replace("i", args).replace("j", args).replace("k", args).replace("l", args).replace("m", args).replace("n", args).replace("o", args).replace("p", args).replace("q", args).replace("r", args).replace("s", args).replace("t", args).replace("u", args).replace("v", args).replace("w", args).replace("x", args).replace("y", args).replace("z", args), logging.output)
}

module.exports.help = {
    name: "corrupt",
    desc: "Completely mess up a phrase.",
    args: "**(phrase)**",
    parameters: "",
    category: "Fun",
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
    unloadable: true,
    requireOwner: false
}

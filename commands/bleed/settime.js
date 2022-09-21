const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latency of the bot.'),
};
*/

module.exports.default = async (message, args, parameter) => {
  if(!config.users[message.author.id]) config.users[message.author.id] = {};
  args = parseInt(args);
  if(isNaN(args)) return message.channel.send("Please input a valid argument.")
  if(args > 14) return message.channel.send("Please input a valid UTC timezone. (-12 to 14)")
  if(args < -12) return message.channel.send("Please input a valid UTC timezone. (-12 to 14)")
  config.users[message.author.id].tz = args
  message.channel.send("Okay, I've set your UTC offset to " + args + ".");
}

module.exports.slash = async (interaction) => {

}

module.exports.help = {
    name: "settime",
    desc: "Sets your current timezone. (currently only shows timezone)",
    args: "**(UTC offset)**",
    parameters: "--to-12h",
    category: "Personalization",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

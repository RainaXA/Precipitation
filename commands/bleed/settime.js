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
  message.channel.send("This command is in development. Sorry for the inconvenience.")
}

module.exports.slash = async (interaction) => {

}

module.exports.help = {
    name: "settime",
    desc: "Sets your current timezone.",
    args: "(timezone)",
    parameters: "",
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

const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latency of the bot.'),
};
*/
let selectedTime = new Date();
console.log(selectedTime.getHours())
console.log(selectedTime.getUTCHours())

module.exports.default = async (message, args, parameter) => {
  let selectedTime = new Date();
  args = parseInt(args);
  if(isNaN(args)) return message.channel.send("Please input a valid argument.")
  let utchour = selectedTime.getUTCHours() + args;
  let minute = selectedTime.getMinutes()
  let second = selectedTime.getSeconds();
  if(utchour < 0) utchour = 24 + utchour
  if(minute < 10) minute = String("0" + minute)
  if(second < 10) second = String("0" + second)
  let sometimething = "";
  if(parameter == "to-12h") {
    if(utchour > 12) {
      utchour -= 12;
      sometimething = "PM"
    } else {
      sometimething = "AM"
    }
  }
  message.channel.send("**Current time:** " + utchour + ":" + minute + ":" + second + sometimething);
}

module.exports.slash = async (interaction) => {

}

module.exports.help = {
    name: "settime",
    desc: "Sets your current timezone. (currently only shows timezone)",
    args: "(timezone)",
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

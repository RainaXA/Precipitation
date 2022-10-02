const { Permissions, MessageActionRow } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latency of the bot.'),
};
*/

try {
  var find = require('../find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will only show message author.", logging.warn, "TIME")
}


module.exports.default = async (message, args, parameter) => {
  let user;
  if(find && args) user = find(args.split(" --")[0].toLowerCase(), 1);
  if(!user) user = message.author;
  if(!config.users[user.id]) config.users[user.id] = {}
  let tz = config.users[user.id].tz;
  if(!tz) return message.channel.send("The selected user (" + user.tag + ") hasn't set their timezone yet.")
  let selectedTime = new Date();
  let utchour = selectedTime.getUTCHours() + tz;
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
  message.channel.send(":clock10: **" + user.tag + ":** " + utchour + ":" + minute + ":" + second + " " + sometimething);
}

module.exports.slash = async (interaction) => {

}

module.exports.help = {
    name: "time",
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

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('See how long Precipitation has been online.'),
};

module.exports.default = async (message, args, parameter) => {
  var time;
  var uptime = parseInt(client.uptime);
  uptime = Math.floor(uptime / 1000);
  var minutes = Math.floor(uptime / 60);
  var seconds = Math.floor(uptime);
  var hours = 0;
  var days = 0;
  while (seconds >= 60) {
    seconds = seconds - 60;
  }
  while (minutes >= 60) {
    hours++;
    minutes = minutes - 60;
  }
  while (hours >= 24) {
    days++;
    hours = hours - 24;
  }
  return message.channel.send("Precipitation has been online for " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.");
}

module.exports.slash = async (interaction) => {
  var time;
  var uptime = parseInt(client.uptime);
  uptime = Math.floor(uptime / 1000);
  var minutes = Math.floor(uptime / 60);
  var seconds = Math.floor(uptime);
  var hours = 0;
  var days = 0;
  while (seconds >= 60) {
    seconds = seconds - 60;
  }
  while (minutes >= 60) {
    hours++;
    minutes = minutes - 60;
  }
  while (hours >= 24) {
    days++;
    hours = hours - 24;
  }
  await interaction.reply ({ content: "Precipitation has been online for " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds." });
}

module.exports.console = async (args) => {
  var time;
  var uptime = parseInt(client.uptime);
  uptime = Math.floor(uptime / 1000);
  var minutes = Math.floor(uptime / 60);
  var seconds = Math.floor(uptime);
  var hours = 0;
  var days = 0;
  while (seconds >= 60) {
    seconds = seconds - 60;
  }
  while (minutes >= 60) {
    hours++;
    minutes = minutes - 60;
  }
  while (hours >= 24) {
    days++;
    hours = hours - 24;
  }
  log(days + "d " + hours + "h " + minutes + "m " + seconds + "s", logging.output)
}

module.exports.help = {
    name: "uptime",
    desc: "See how long Precipitation has been online.",
    args: "",
    parameters: "",
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

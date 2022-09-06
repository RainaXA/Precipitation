const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const pingMessages = ["Pinging...", "Ponging...", "Hacking the mainframe...",  "Going bowling with Roman...", "Trying to become funny...", "Making more ping messages...", "who's joe", "pay my onlyfans", "doin ya mom", "living the american dream", "don't care + didn't ask", "ooh, ee, ooh ah ah, ting tang, wallawallabingbang", "I TOLD THE WITCH DOCTOR I WAS IN LOVE WITH YOU", "will the real slim shady please stand up", "Telling the witch doctor I was in love with you...", "i think i'm going insane", "Expressing myself...", "omg, you're a redditor AND a discord mod?", "i use arch btw", "I've come to make an announcement", "CLARA", "jett rebibe me", "police crash green screen", "apparently i committed tax fraud but idk how that happened, i dont even pay tax????"]

try {
  var name = require('./name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "PING")
  function name(user) {
    return user.username;
  }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latency of the bot.'),
};

module.exports.default = async (message, args, parameter) => {
  let user = name(message.author);
  let rng = Math.floor(Math.random() * pingMessages.length)
  let startTime = Date.now()
  message.channel.send("<:ping_receive:502755206841237505> " + pingMessages[rng]).then(function(message) {
    message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + user + "!");
  })
}

module.exports.slash = async (interaction) => {
  let rng = Math.floor(Math.random() * pingMessages.length)
  let startTime = Date.now()
  await interaction.reply({ content: "<:ping_receive:502755206841237505> " + pingMessages[rng] })
  await interaction.editReply({ content: "<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + interaction.user.username + "!" })
}

module.exports.console = async (args) => {
  log("Hello!", logging.output)
}

module.exports.help = {
    name: "ping",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
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
    unloadable: true,
    requireOwner: false
}

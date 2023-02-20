const { SlashCommandBuilder } = require('@discordjs/builders');
const pingMessages = ["Pinging...", "Ponging...", "pay my onlyfans", "doin ya mom", "don't care + didn't ask", "ooh, ee, ooh ah ah, ting tang, wallawallabingbang", "omg, you're a redditor AND a discord mod?", "i use arch btw", "I've come to make an announcement", "police crash green screen", "apparently i committed tax fraud but idk how that happened, i dont even pay tax????", "A Discord Bot where it can do anything and a moderation bot and made in discord.js!!!!", "did you know that 100% of people who drown die", "...\n\n\n\n\n\n\n\nwhoa what is this", "Fortnite Funnies Vol. 1", "Poopenfarten"]

try {
    var name = require('./name.js').exports.name;
} catch(err) {
    log("name function not found - defaulting to discord username only.", logging.warn, "ping")
    function name(user) {
      return user.username;
    }
}

var command = {
    name: "ping",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "",
    execute: {
        discord: function(message) {
            let user = name(message.author);
            let rng = Math.floor(Math.random() * pingMessages.length)
            let startTime = Date.now()
            message.channel.send("<:ping_receive:502755206841237505> " + pingMessages[rng]).then(function(message) {
                message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + user + "!");
            })
        },
        slash: async function (interaction) {
            let rng = Math.floor(Math.random() * pingMessages.length)
            let startTime = Date.now()
            await interaction.reply({ content: "<:ping_receive:502755206841237505> " + pingMessages[rng] })
            await interaction.editReply({ content: "<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + interaction.user.username + "!" })
        },
        console: function() {
            log("testing with the new handler!", logging.output, "PING")
        }
    },
    ver: "3.0.0",
    cat: "General",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc)
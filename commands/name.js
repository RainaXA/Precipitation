const { SlashCommandBuilder } = require('@discordjs/builders');

var command = {
    name: "name",
    desc: "Sets the name for the bot to refer to you as.",
    args: "(args)",
    parameters: "",
    execute: {
        discord: function(message, args) {
            if(args.length >= 75) return message.channel.send("That's too long of a name.")
            if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("I won't ping anyone.")
            if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
            if(args == "") {
                config.users[message.author.id].name = null;
                return message.channel.send("Sure, I'll refer to you by your username.")
            }
            config.users[message.author.id].name = args;
            return message.channel.send("Sure, I'll refer to you by \"" + args + "\".")
        },
        //slash: async function (interaction) { TODO: FIX LATER
           // let rng = Math.floor(Math.random() * pingMessages.length)
           // let startTime = Date.now()
           // await interaction.reply({ content: "<:ping_receive:502755206841237505> " + pingMessages[rng] })
           // await interaction.editReply({ content: "<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + interaction.user.username + "!" })
        //}
    },
    ver: "3.0.0",
    cat: "Personalization",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.exports = {};
module.exports.exports.name = function (user) {
    if(!config.users[user.id].name) {
      return user.username
    } else {
        return config.users[user.id].name
    }
}; // export
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addStringOption(option =>
    option.setName('name')
    .setDescription('Set the name for the bot to refer to you as.')
    .setRequired(false))
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
        slash: async function (interaction) {
            let string = interaction.options.getString('name')
            if(!string) {
                config.users[interaction.user.id].name = null;
                return interaction.reply({ content: "Sure. I'll refer to you by your username." })
            }
            if(string.length >= 75) return interaction.reply({ content: "That's too long of a name.", ephemeral: true })
            if((string.includes("<@") && string.includes(">")) || string.includes("@everyone") || string.includes("@here")) return interaction.reply({ content: "I won't ping anyone.", ephemeral: true })
            if(getTextInput(string, host.slurs)) return interaction.reply({ content: "Hey, I'm not going to yell out offensive words.", ephemeral: true })
            config.users[interaction.user.id].name = string;
            return interaction.reply({ content: "Sure, I'll refer to you by \"" + string + "\"." })
        }
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

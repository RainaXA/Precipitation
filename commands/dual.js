const { SlashCommandBuilder } = require('@discordjs/builders');

var commands = {
    "test": {
        name: "test",
        desc: "A fast test of multiple commands in one module (command #1)",
        args: "",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This is a test of two commands being in the same file!!")
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Not to mention, the slash variant..." })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "3.0.0",
        cat: "Shorthair Testing",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "tester": {
        name: "tester",
        desc: "A fast test..er of multiple commands in one module (command #2)",
        args: "",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This is the second command!")
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Once again, the slash variant as well.." })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "3.0.0",
        cat: "Shorthair Testing",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    }
}

module.exports = commands;
for(item in commands) {
    commands[item].data = new SlashCommandBuilder().setName(commands[item].name).setDescription(commands[item].desc)
}
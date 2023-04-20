/* ========================================================================= *\
    rm: Precipitation command to bulk delete messages
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

var command = {
    name: "rm",
    alias: ["purge"],
    desc: "Bulk delete messages.",
    args: {
        "number": {
            "desc": "The number of messages to bulk delete (between 1-99)",
            "required": true
        }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
            if(parseInt(args) == 0) return message.channel.send("Okay, I didn't delete any messages.")
            if(parseInt(args) > 99 || parseInt(args) < 0) return message.channel.send("Please keep your number between 1-99.")
            try {
                if(parseInt(args) == 1) {
                return message.channel.bulkDelete(2, { filterOld: true }).then(messages => {
                    message.channel.send("Okay, I've deleted the above message. (really?)") // it's funny
                })
                }
                return message.channel.bulkDelete(parseInt(args) + 1, { filterOld: true }).then(messages => {
                if(parseInt(args) + 1 == messages.size) {
                    message.channel.send("Okay, I've deleted " + args + " messages.")
                } else {
                    message.channel.send("Unfortunately, due to Discord limitations, I could only delete " + messages.size + " messages.")
                }
                })
            } catch (err) {
                message.channel.send("Due to a fatal error, the messages could not be deleted.")
            }
        },
        slash: async function (interaction) {
            let int = interaction.options.getInteger('remove');
            if(int == 0) return interaction.reply({ content: "Okay, I didn't delete any messages." })
            if(int > 99 || int < 0) return interaction.reply({ content: "Please keep your number between 1-99.", ephemeral: true })
            try {
                if(int == 1) {
                return interaction.channel.bulkDelete(1, {filterOld: true}).then(messages => {
                    interaction.reply({ content: "Okay, I've deleted the above message. (really?)" })
                })
                }
                return interaction.channel.bulkDelete(int, {filterOld: true}).then(messages => {
                if (messages.size == int) {
                    interaction.reply({ content: "Okay, I've deleted " + int + " messages." })
                } else {
                    interaction.reply({ content: "Some of these messages are over two weeks old (or an interaction) - I could only delete " + messages.size + " messages." })
                }
                })
            } catch(err) {
                interaction.reply({ content: "Due to a fatal error, I couldn't delete any messages.", ephemeral: true })
            }
        }
    },
    ver: "3.2.0",
    cat: "Moderation",
    prereqs: {
        dm: false,
        owner: false,
        user: [Permissions.FLAGS.MANAGE_MESSAGES],
        bot: [Permissions.FLAGS.MANAGE_MESSAGES]
    },
    unloadable: true
}

module.exports = command;
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addIntegerOption(option =>
    option.setName('remove')
    .setDescription('Delete x amount of messages. [between 1-99]')
    .setRequired(true))
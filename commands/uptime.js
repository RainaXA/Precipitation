/* ========================================================================= *\
    Uptime: Precipitation command for showing how long the bot has been online
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

const { SlashCommandBuilder } = require('@discordjs/builders');

var command = {
    name: "uptime",
    desc: "See how long Precipitation has been online.",
    args: "",
    parameters: "",
    execute: {
        discord: function(message) {
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
        },
        slash: async function (interaction) {
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
        },
        console: function() {
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
            log(days + "d " + hours + "h " + minutes + "m " + seconds + "s", logging.output, "uptime")
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
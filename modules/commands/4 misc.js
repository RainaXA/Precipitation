/* ========================================================================= *\
    Ping: Precipitation command to show the client latency
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
const { EmbedBuilder } = require('discord.js')
const fs = require('fs')

var commands = {
    "list": {
        name: "list",
        alias: [],
        desc: "Picks an entry from a list.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                let cArg = args.split(" ")
                if(!config.users[message.author.id]) config.users[message.author.id] = {};
                switch(cArg[0]) {
                    case "save":
                        if(!cArg[1]) return message.channel.send("You must input a list, separated by commas.")
                        let list = args.slice(5).split(",");
                        if(!list[1]) return message.channel.send("You must have at least 2 arguments for the list.")
                        if(getTextInput(args.slice(5), host.slurs)) return message.channel.send("Sorry, but I will not include offensive text in a list.")
                        config.users[message.author.id].list = args.slice(5)
                        return message.channel.send("Your list has been saved.")
                    case "pick":
                        if(args.toLowerCase() == "pick") {
                            if(!config.users[message.author.id].list) return message.channel.send("You must first save a list.")
                            let listt = config.users[message.author.id].list.split(",");
                            let rng = Math.floor(Math.random() * listt.length)
                            let item = listt[rng]
                            message.channel.send(item)
                        } else {
                            let listt = args.slice(5).split(",");
                            let rng = Math.floor(Math.random() * listt.length)
                            let item = listt[rng]
                            message.channel.send(item)
                        }
                        break;
                    case "view":
                        if(!config.users[message.author.id].list) return message.channel.send("You must first save a list.")
                        return message.channel.send(config.users[message.author.id].list);
                    default:
                        return message.channel.send("That is not a valid argument for this command.")
                }
            }
        },
        ver: "4.0.0",
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
module.exports.info = "Miscellaneous";
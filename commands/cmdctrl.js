/* ========================================================================= *\
    Command Control: WIP commands
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

const { Permissions, MessageEmbed } = require('discord.js')

var commands = {
    "load": {
        name: "load",
        desc: "Load a command into memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    },
    "unload": {
        name: "unload",
        desc: "Unloads a command from memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    },
    "enable": {
        name: "enable",
        desc: "Unloads a command from memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args.toLowerCase() == "all") {
                    config.guilds[message.guild.id].disabled = [];
                    return message.channel.send("All commands are now enabled in this server.")
                }
                if(!getTextInput(args.toLowerCase(), config.guilds[message.guild.id].disabled, 2)) return message.channel.send("This command is not disabled.")
                let nu = config.guilds[message.guild.id].disabled.findIndex((command) => args.toLowerCase() == command);
                config.guilds[message.guild.id].disabled.splice(nu, 1);
                message.channel.send("Okay, the command `" + args.toLowerCase() + "` is now enabled in this server.");
            }
        },
        ver: "3.0.0",
        cat: "Commands",
        prereqs: {
            dm: false,
            owner: false,
            user: [Permissions.FLAGS.MANAGE_GUILD],
            bot: []
        },
        unloadable: true
    },
    "disable": {
        name: "disable",
        desc: "Unloads a command from memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args.toLowerCase() == "view") {
                    let list = "";
                    config.guilds[message.guild.id].disabled.forEach(cmd => {
                        list = list + cmd + "\n";
                    })
                    if(list == "") return message.channel.send("There are no disabled commands in this server.")
                    let embed = new MessageEmbed()
                    .setTitle("Disabled Commands")
                    .setDescription(list)
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                    message.channel.send({embeds: [embed]})
                } else {
                    let cmd = client.commands.get(args.toLowerCase());
                    if(!cmd) return message.channel.send("This command wasn't found. Please use `" + config.guilds[message.guild.id].prefix + "help` to see the list of all commands.")
                    if(cmd.name == "enable") return message.channel.send("This command cannot be disabled.")
                    if(getTextInput(cmd.name, config.guilds[message.guild.id].disabled, 2)) return message.channel.send("This command has already been disabled.")
                    config.guilds[message.guild.id].disabled.push(args.toLowerCase());
                    message.channel.send("Okay, the command `" + args.toLowerCase() + "` is now disabled in this server.")
                }
            }
        },
        ver: "3.0.0",
        cat: "Commands",
        prereqs: {
            dm: false,
            owner: false,
            user: [Permissions.FLAGS.MANAGE_GUILD],
            bot: []
        },
        unloadable: true
    }
}

module.exports = commands;
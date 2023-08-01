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

const fs = require('fs');

var commands = {
    "load": {
        name: "load",
        alias: [],
        desc: "Load a command into memory.",
        args: {
            "option": {
                "desc": "The command to load, or `view` to see a full list of all files within the commands folder",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args.toLowerCase() == "view") {
                    let embed;
                    fs.readdir("./commands", (err, files) => {
                        let list = "";
                        files.forEach(file => {
                            list += file + "\n"
                        })
                        embed = new MessageEmbed()
                        embed.setTitle("Command Module List")
                        embed.addField("List", list)
                        embed.setColor(host.color)
                        embed.setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                        return message.channel.send({embeds: [embed]})
                    })
                } else {
                    let cmd = require(`./${args.toLowerCase()}` + ".js");
                    if(!cmd.name) {
                        for(item in cmd) {
                            client.commands.set(cmd[item].name, cmd[item]);
                        }
                    } else {
                        client.commands.set(cmd.name, cmd);
                    }
                    return message.channel.send("Command module \"" + args.toLowerCase() + "\" has been loaded.")
                }
            }
        },
        ver: "3.2.0",
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
        alias: [],
        desc: "Unloads a command from memory.",
        args: {
            "command": {
                "desc": "The command to unload",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                let cmd;
                if(args.toLowerCase() == "cmdctrl") return message.channel.send("This command module is a core component of Precipitation modularity and cannot be unloaded.")
                fs.readdir("./commands", (err, files) => {
                    let modules = files.filter(f => f.split(".").pop() === "js");
                    modules.forEach((f, i) => {
                        if(f == (args.toLowerCase() + ".js")) {
                            cmd = require(`./${f}`);
                            if(!cmd.name) {
                                for(item in cmd) {
                                    client.commands.delete(cmd[item].name)
                                }
                              } else {
                                client.commands.delete(cmd.name)
                              }
                        }
                    })
                    if(!cmd) return message.channel.send("Command module \"" + args.toLowerCase() + "\" couldn't be found.")
                }) 
                let ul = require.resolve("./" + args.toLowerCase() + ".js");
                delete require.cache[ul]
                message.channel.send("Command module \"" + args.toLowerCase() + "\" has been unloaded.")
                return log("Command module \"" + args.toLowerCase() + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.warn, "cmdctrl")
            },
            console: function(args) {
                
            }
        },
        ver: "3.2.0",
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
        alias: [],
        desc: "Allows a command to be executed in a server.",
        args: {
            "command": {
                "desc": "The command to enable",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(!args) return message.channel.send("Please return an argument.")
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
        ver: "3.2.0",
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
        alias: [],
        desc: "Disallows execution of a specified command in the server.",
        args: {
            "command": {
                "desc": "The command to disable",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(!args) return message.channel.send("Please return an argument.")
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
        ver: "3.2.0",
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
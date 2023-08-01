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

// SHUTDOWN
let shutdown = false;
let shutdownMessage;
let ignore = false;

function cancelShutdown(code) {
    if(!shutdown) return;
    shutdown = false;
    ignore = false;
    switch(code) {
        case 0: // time
            return shutdownMessage.edit("*The shutdown has been cancelled because the time has expired.*")
        case 1: // improper save
            return shutdownMessage.edit("*The shutdown has been cancelled because the configuration file couldn't be properly saved.*")
        default:
            return shutdownMessage.edit("*The shutdown has been cancelled because of an unknown reason.*")
    }
}

var commands = {
    "shutdown": {
        name: "shutdown",
        alias: [],
        desc: "Shuts down the bot.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                if(parameter.toLowerCase() == "disregard") {
                    message.channel.send("Precipitation is now saving configuration, and then will exit.").then(m => {
                        fs.writeFile('config.json', JSON.stringify(config), function (err) {
                            if (!err) {
                                m.edit("Precipitation is now offline.").then(m => {
                                    process.exit()
                                })
                            }
                            if (err) {
                                m.edit("Precipitation will not be shut down because of a serious error while saving the configuration file.")
                            }
                        })
                    })
                    return;
                } else if(parameter.toLowerCase() == "ignore-config") ignore = true;
                if(!shutdown) {
                    shutdown = true;
                    let sdmsg = "**WARNING:** This will shut down the bot, leaving it unusable until it is turned back on! This should only be done in EXTREME circumstances, such as a serious exploit.\nIf you wish to restart the bot to update, it is better practice to perform this command through the console anyways.\n\nIf you wish to shut down the bot anyways, please execute `" + host.prefix + "shutdown` again. After 30 seconds, this message will be changed and the shutdown process will be cancelled.";
                    if(ignore) sdmsg = "**WARNING:** This will shut down the bot, leaving it unusable until it is turned back on! This should only be done in EXTREME circumstances, such as a serious exploit.\nIf you wish to restart the bot to update, it is better practice to perform this command through the console anyways.\n\n**The configuration file will not be saved - so data may not be saved.**\n\nIf you wish to shut down the bot anyways, please execute `" + host.prefix + "shutdown` again. After 30 seconds, this message will be changed and the shutdown process will be cancelled.";
                    message.channel.send(sdmsg).then(m => {
                        shutdownMessage = m;
                        setTimeout(cancelShutdown, 30000, 0);
                    })
                } else {
                    if(ignore) {
                        message.channel.send("Precipitation is now offline.").then(m => {
                            process.exit();
                        })
                    }
                    message.channel.send("Precipitation is now saving configuration, and then will exit.").then(m => {
                        fs.writeFile('config.json', JSON.stringify(config), function (err) {
                            if (!err) {
                                m.edit("Precipitation is now offline.").then(m => {
                                    process.exit()
                                })
                            }
                            if (err) {
                                cancelShutdown(1);
                                m.edit("Precipitation will not be shut down because of a serious error while saving the configuration file.")
                            }
                        })
                    })
                }
            },
            slash: async function (interaction) {
                
            },
            console: function() {
                
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "eval": {
        name: "eval",
        alias: [],
        desc: "Evaluates JavaScript code.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                try {
                    if(args.includes("host") && args.includes("token")) return message.channel.send("Whoa! Be careful Raina, don't go messing with the token! You could reveal it!")
                    if(!args.includes(".send")) {
                        let evaled = eval(args);
                        //console.log(evaled)
                        let embed = new EmbedBuilder()
                        .setTitle("Precipitation Code Evaluation")
                        .addFields(
                            { name: "Input", value: "```js\n" + args + "```" },
                            { name: "Output", value: "```js\n" + String(evaled) + "```" }
                        )
                        .setColor(host.color)
                        .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                        message.channel.send({embeds: [embed]})
                    } else { // if we're sending something to a channel, then don't bother sending the evaluation embed
                        eval(args)
                    }
                } catch(err) {
                    let eEmbed = new EmbedBuilder()
                    .setTitle("Precipitation Code Evaluation Exception")
                    .setDescription(String(err))
                    .setColor("RED")
                    .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    message.channel.send({embeds: [eEmbed]})
                }
            },
            slash: async function (interaction) {
                
            },
            console: function() {
                
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: true,
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
module.exports.info = "Owner";
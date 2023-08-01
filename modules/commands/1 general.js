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

const { EmbedBuilder, Embed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const pingMessages = ["Pinging...", "Ponging...", "pay my onlyfans", "doin ya mom", "don't care + didn't ask", "omg, you're a redditor AND a discord mod?", "apparently i committed tax fraud but idk how that happened, i dont even pay tax????", "A Discord Bot where it can do anything and a moderation bot and made in discord.js!!!!", "...\n\n\n\n\n\n\n\nwhoa what is this", "Fortnite Funnies Vol. 1", "Poopenfarten", "good people don't brag about how good they are", "https://pbs.twimg.com/media/FXBaEuFWIAA6LtD.png"]
const os = require('os')

var logs = require("../../data/changelogs.json")
var releases = require("../../data/releases.json")

let name = require('./2 personalization.js')
let findU = require('./3 moderation.js')

var commands = {
    "ping": {
        name: "ping",
        alias: [],
        desc: "Gets the current latency of the bot.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message) {
                let user = message.author.username;
                if(name) user = getName(message.author);
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
                await interaction.editReply({ content: "<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + message.author.username + "!" })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
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
    },
    "help": {
        name: "help",
        alias: ["commands"],
        desc: "Shows a list of all Precipitation commands and provides information on them.",
        args: {},
        parameters: "[--internal]",
        execute: {
            discord: function(message, args, parameter) {
                let cmd;
                if(args) cmd = client.commands.get(args.toLowerCase());
                if(cmd) {
                    let aliasList = "";
                    if(cmd.alias) {
                        for(alias of cmd.alias) {
                            aliasList = aliasList + alias + "\n";
                        }
                        if(aliasList === "") aliasList = "*None.*"
                    }
                    let syntax = "";
                    for(arg in cmd.args) {
                        if(cmd.args[arg].required) syntax += "**(" + arg + ")** "
                        if(!cmd.args[arg].required) syntax += "(" + arg + ") "
                    }
                    let helpEmbed = new EmbedBuilder()
                    .setTitle("Precipitation Index >> " + host.prefix + cmd.name)
                    .setDescription(cmd.desc)
                    .addFields(
                        { name: "Global Aliases", value: aliasList, inline: true },
                        { name: "Server Aliases", value: ";)", inline: true },
                        { name: "Syntax", value: host.prefix + cmd.name + " " + syntax }
                    )
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                    return message.channel.send({embeds: [helpEmbed]});
                }
                let cmdList;
                let helpEmbed = new EmbedBuilder()
                .setTitle("Precipitation Index")
                .setDescription('The following is a list of all Precipitation commands. All commands must be prefixed with `' + host.prefix + '`.\nYou may view more information on a command using `' + host.prefix + 'help (command)`, and help on an argument using `' + host.prefix + 'help (command) (argument)`')
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                for(list in client.categories) {
                    cmdList = client.categories[list];
                    if(message.guild) {
                        for(command of config.guilds[message.guild.id].disabled) {
                            if(forecast.arrays.getText(client.categories[list], config.guilds[message.guild.id].disabled, 0)) cmdList = client.categories[list].replace("\n" + command, "~~\n" + command + "~~");
                        }
                    }
                    helpEmbed.addFields({ name: list, value: cmdList, inline: true })
                }
                return message.channel.send({embeds: [helpEmbed]});
            },
            console: function() {
                log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output, "version")
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
    },
    "version": {
        name: "version",
        alias: ["ver"],
        desc: "Shows the current bot version.",
        args: {
            "version": {
                "desc": "The version to view changelogs of",
                "required": false
            }
        },
        parameters: "[--internal]",
        execute: {
            discord: function(message, args, parameter) {
                if(parameter.toLowerCase() == "internal") return message.channel.send("Precipitation " + host.version.internal + " [Forecast " + version.string + " " + version.name + " | discord.js@" + package.dependencies["discord.js"] + "]")
                if(args) {
                    let changelog = logs.numerical[args]
                    if(!changelog) changelog = logs.versionName[args.toLowerCase()]
                    if(!changelog) return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
                    if(changelog == logs.versionName[args.toLowerCase()]) {
                    let embed = new EmbedBuilder()
                    .setTitle(changelog.name)
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                    for(change in changelog.changes) {
                        embed.addFields({ name: change, value: changelog.changes[change] })
                    }
                    return message.channel.send({embeds:[embed]});
                    } else {
                    let embed = new EmbedBuilder()
                    .setTitle(changelog.name)
                    .addFields({ name: "Changes", value: changelog.changes })
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                    return message.channel.send({embeds:[embed]});
                    }
                }
                return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Precipitation " + host.version.external + " " + host.version.name + " (" + host.version.internal + ")" })
            },
            console: function() {
                log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output, "version")
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
    },
    "config": {
        name: "config",
        alias: [],
        desc: "Changes server-specific configuration settings.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                message.channel.send("AYO THIS AIN'T READY YET CUZ IT AIN'T DEVELOPED ENOUGH YET")
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
    },
    "about": {
        name: "about",
        alias: [],
        desc: "Shows information on the bot and general technical specifications.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                let osEmoji;
                switch(os.platform()) {
                    case "win32":
                        osEmoji = "<:windows:1128911579304435772>"
                        break;
                    case "darwin":
                        osEmoji = "<:macos:1128912615003930665>"
                        break;
                    case "linux":
                        osEmoji = "<:linux:1128912967681986560>"
                        break;
                }
                let embed = new EmbedBuilder()
                .setTitle("Precipitation " + host.version.external)
                .setDescription('General-purpose Discord bot')
                .addFields(
                    { name: "Credits", value: "<:succubus2:1128367730924474378> **@succubus2** - bot developer\n<:sasha_pc:1128367729703932016> **@sasha_pc** - bug finder\n<:owohai:1128367727770349748> **@owohai** - hosting the bot!\n**all contributors of the [countries, states, and cities database](https://github.com/dr5hn/countries-states-cities-database)** (ODbL-1.0)" },
                    { name: "Next Release", value: releases["stable"] },
                    { name: "Links", value: "[GitHub](https://www.github.com/RainaXA/Precipitation)\n[Support Server](https://discord.gg/kasmyXa)\n[Invite Precipitation](https://discord.com/api/oauth2/authorize?client_id=322397835716853771&permissions=8&scope=applications.commands%20bot)" },
                    //{ name: "Alternate Projects", value: "[Precipitation.rb](https://discord.com/api/oauth2/authorize?client_id=1082791237662281808&permissions=8&scope=bot) - created by Idk837384#8148", inline: true}
                    { name: "Hosting Information", value: `${osEmoji} **OS**: ${os.version()}\n**Forecast Version**: ${version.string} ${version.name}\n**Discord.js Version**: ${discordJsVersion.join(".")}\n**Available RAM**: ${(os.freemem()/1073741824).toFixed(2)}GB/${(os.totalmem()/1073741824).toFixed(2)}GB (using ${(process.memoryUsage().external * 10 / (1024 * 1024)).toFixed(1)}MB)` }
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                message.channel.send({embeds: [embed]});
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Precipitation " + host.version.external + " " + host.version.name + " (" + host.version.internal + ")" })
            },
            console: function() {
                log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output, "version")
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
    },
    "uptime": {
        name: "uptime",
        alias: [],
        desc: "See how long Precipitation has been online.",
        args: {},
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
    },
    "pic": {
        name: "pic",
        alias: ["pfp", "avatar"],
        desc: "Gets the profile picture of yourself or another user.",
        args: {
            "user": {
                "desc": "The user to get the profile picture of",
                "required": false
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                let user;
                if(args && findU) user = find(args.toLowerCase(), 1);
                if(!user) user = message.author
                let embed = new EmbedBuilder()
                .setTitle("@" + user.username + "'s Profile Picture")
                .setImage(user.displayAvatarURL())
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                .setColor(host.color)
                message.channel.send({embeds: [embed]})
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Precipitation " + host.version.external + " " + host.version.name + " (" + host.version.internal + ")" })
            },
            console: function() {
                log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output, "version")
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
    },
    "sinfo": {
        name: "sinfo",
        alias: ["serverinfo", "ginfo"],
        desc: "Gets the current server info.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args, parameter) {
                let embed = new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .addFields(
                    { name: "Dates", value: "**Created**: <t:" + parseInt(message.guild.createdTimestamp / 1000, 10) + ">\n**Precipitation Joined**: <t:" + parseInt(message.guild.joinedTimestamp / 1000, 10) + ">"},
                    { name: "Members", value: "👥 **Member Count**: " + message.guild.memberCount + " (" + message.guild.members.cache.filter(member => member.user.bot).size + " bots)\n 👑 **Server Owner**: <@" + message.guild.ownerId + ">" },
                    { name: "Misc.", value: "**Boosts:** " + message.guild.premiumSubscriptionCount }
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                message.channel.send({embeds: [embed]})
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
module.exports.info = "General";
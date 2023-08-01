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
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

sources.moderation = "moderation";
var personalization = forecast.require("./commands/2 personalization.js", function() {
    log("personalization command category not found", logging.warn, sources.moderation);
})

global.find = function(query, amount) {
    let results = {};
    results.amount = 0;
    results.list = "";
    let users = client.users.cache
    if(amount == 1) { // get first user
      users.each(user => {
        if(user.username.startsWith(query)) {
          if(results.amount == undefined) return; // don't go to the last in the alphabet, dont do anything else if we've found a user.
          if(!user.bot) results = user; // prefer to ignore bots when only finding one user
        }
      })
    } else { // get a list for more than one user
      users.each(user => {
        if(user.username.startsWith(query)) {
          if(results.amount < amount) results.list += "@" + user.username + "\n";
          results.amount++;
        }
      })
    }
    if(results.amount == 0) return null;
    return results;
}

var warningStage = {};
var warnedUser = {};
var removeWarnNumber = {};

var commands = {
    "find": {
        name: "find",
        alias: [],
        desc: "Searches for a user using a query.",
        args: {
            "query": {
                "desc": "What to search for in the user list",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(!args) return message.channel.send("Please input an argument.")
                let findList = find(args.toLowerCase(), 10);
                if(!findList) return message.channel.send("No results were found - please try being more lenient with your search.")
                let bottomText = host.version.external;
                if(findList.amount >= 10) {
                    findList.amount -= 10;
                    bottomText += " || There are " + findList.amount + " results not shown -- please narrow your query."
                }
                let embed = new EmbedBuilder()
                .setTitle("Precipitation Query")
                .addFields(
                    { name: "Results", value: findList.list}
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + bottomText, iconURL: client.user.displayAvatarURL() });
                return message.channel.send({embeds: [embed]})
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
    "uinfo": {
      name: "uinfo",
      alias: [],
      desc: "Gets general information on a user.",
      args: {},
      parameters: "",
      execute: {
          discord: function(message, args) {
            let uinfoUser;
            if(args) {
                uinfoUser = find(args.toLowerCase(), 1)
                if(!uinfoUser) return message.channel.send("Couldn't find a user by that name.")
            } else {
                uinfoUser = message.author;
            }
            let accDates = "**Creation Date**: <t:" + parseInt(uinfoUser.createdTimestamp / 1000, 10) + ">"
            let names = "**Username**: @" + uinfoUser.username
            let botInfo = "**Name**: " + getName(uinfoUser) + "\n**Pronouns**: " + getPronouns(uinfoUser, "*not set*") + "\n**Birthday**: " + birthday(config.users[uinfoUser.id].birthday) + "\n**Location**: " + location(uinfoUser)
            let uinfoMember;
            if(message.guild) {
                message.guild.members.cache.each(member => {
                    if(uinfoUser.id == member.id) {
                      return uinfoMember = member; // search all members in the guild and if they are in the guild, then display more results
                    }
                })
            }
            if (uinfoMember) {
                accDates = accDates + "\n**Join Date**: <t:" + parseInt(uinfoMember.joinedTimestamp / 1000, 10) + ">"
            }
            let uinfo = new EmbedBuilder()
            .setTitle("User Information || @" + uinfoUser.username)
            .addFields(
                { name: "Account Dates", value: accDates, inline: true },
                { name: "Names", value: names },
                { name: "Bot Info", value: botInfo}
            )
            .setColor(host.color)
            .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
            return message.channel.send({embeds: [uinfo]})
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
    "rm": {
        name: "rm",
        alias: [],
        desc: "Bulk deletes messages.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(parseInt(args) == 0) return message.channel.send("Okay, I didn't delete any messages.")
                if(parseInt(args) > 99 || parseInt(args) < 0) return message.channel.send("Please keep your number between 1-99.")
                try {
                    return message.channel.bulkDelete(parseInt(args) + 1, { filterOld: true }).then(messages => {
                        if(parseInt(args) + 1 == messages.size) {
                            if(parseInt(args) == 1) {
                                message.channel.send("Okay, I've deleted the above message. (really?)") // it's funny
                            } else {
                                message.channel.send("Okay, I've deleted " + args + " messages.")
                            }
                        } else {
                            message.channel.send("Unfortunately, due to Discord limitations, I could only delete " + messages.size + " messages.")
                        }
                    })
                } catch (err) {
                    message.channel.send("Due to a fatal error, the messages could not be deleted.")
                }
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [PermissionsBitField.Flags.ManageMessages],
            bot: [PermissionsBitField.Flags.ManageMessages]
        },
        unloadable: true
    },
    "warn": {
        name: "warn",
        alias: [],
        desc: "Warns a user.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                let user;
                if(args) {
                    user = find(args.toLowerCase(), 1)
                    if(!user) return message.channel.send("Couldn't find a user by that name.")
                } else {
                    return message.channel.send("Please input a user.")
                }
                if(!config.users[user.id]) config.users[user.id] = {};
                if(!config.guilds[message.guild.id].warnings) config.guilds[message.guild.id].warnings = {};
                if(!config.guilds[message.guild.id].warnings[user.id]) config.guilds[message.guild.id].warnings[user.id] = [];
                let userMember = false;
                message.guild.members.cache.each(member => {
                    if(user.id == member.id) {
                        return userMember = true;
                    }
                })
                if(!userMember) return message.channel.send("Sorry, but this user is not in the server.")
                if(config.guilds[message.guild.id].warnings[user.id].length > 9) return message.channel.send("Sorry, but Precipitation currently only supports up to 9 warnings per user.")
                warnedUser[message.author.id] = user;
                message.channel.send("Please give a reason for warning @" + user.username + " (" + getName(user) + ").");
                warningStage[message.author.id] = 1;
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [PermissionsBitField.Flags.ManageNicknames],
            bot: []
        },
        unloadable: true
    },
    "lswarn": {
        name: "lswarn",
        alias: [],
        desc: "View current warnings for yourself or someone else.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                let user;
                let mUser;
                if(args && find) {
                    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return message.channel.send("You do not have permission to view another user's warnings.")
                    user = find(args.toLowerCase(), 1)
                    if(!user) return message.channel.send("Couldn't find a user by that name.")
                    message.guild.members.cache.each(member => {
                    if(user.id == member.id) {
                        return mUser = member;
                    }
                    })
                    if(!config.users[user.id]) config.users[user.id] = {};
                    if(!config.guilds[message.guild.id].warnings) config.guilds[message.guild.id].warnings = {};
                    if(!config.guilds[message.guild.id].warnings[user.id]) config.guilds[message.guild.id].warnings[user.id] = [];
                    let warnings = config.guilds[message.guild.id].warnings[user.id];
                    if(warnings.length == 0) return message.channel.send(user.username + " (" + getName(user) + ") appears to have no warnings.")
                    let warningEmbed = new EmbedBuilder()
                    .setTitle("Warnings List for @" + user.username)
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() });
                    for(let i = 0; i < warnings.length; i++) {
                        warningEmbed.addFields(
                            { name: "Warning #" + (i + 1), value: "*" + warnings[i] + "*" }
                        )
                    }
                    return message.channel.send({embeds: [warningEmbed]})
                } else {
                    if(!config.users[message.author.id]) config.users[message.author.id] = {};
                    if(!config.guilds[message.guild.id].warnings[message.author.id]) config.guilds[message.guild.id].warnings[message.author.id] = [];
                    let warnings = config.guilds[message.guild.id].warnings[message.author.id];
                    if(warnings.length == 0) return message.channel.send("You appear to have no warnings.")
                    let warningEmbed = new EmbedBuilder()
                    .setTitle("Warnings List for @" + message.author.username)
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() });
                    for(let i = 0; i < warnings.length; i++) {
                        warningEmbed.addFields(
                            { name: "Warning #" + (i + 1), value: "*" + warnings[i] + "*" }
                        )
                    }
                    return message.channel.send({embeds: [warningEmbed]})
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
    },
    "rmwarn": {
        name: "rmwarn",
        alias: [],
        desc: "Removes a particular warning from a user.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(!args) return message.channel.send("Please return an argument.");
                let numArgs = (args.split(" "))[0]
                let newArgs = args.slice(numArgs.length + 1)
                if(newArgs && find) {
                    var removeUser = find(newArgs.toLowerCase(), 1)
                    if(!removeUser) return message.channel.send("Couldn't find a user by that name.")
                } else {
                    return message.channel.send("Please enter a user.")
                }
                if(!config.users[removeUser.id]) config.users[removeUser.id] = {};
                if(!config.guilds[message.guild.id].warnings[removeUser.id]) config.guilds[message.guild.id].warnings[removeUser.id] = [];
                let userMember = false;
                message.guild.members.cache.each(member => {
                    if(removeUser.id == member.id) {
                        return userMember = true;
                    }
                })
                if(!userMember) return message.channel.send("Sorry, but this user is not in the server.")
                if (isNaN(parseInt(numArgs)) || parseInt(numArgs) < 1 || parseInt(numArgs) > config.guilds[message.guild.id].warnings[removeUser.id].length) return message.channel.send("Please enter a valid number.")
                warnedUser[message.author.id] = removeUser;
                warningStage[message.author.id] = 2;
                removeWarnNumber[message.author.id] = numArgs;
                return message.channel.send("Removing warning #" + numArgs + " from " + removeUser.username + " (" + getName(removeUser) + "). Are you sure?")
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [PermissionsBitField.Flags.ManageNicknames],
            bot: []
        },
        unloadable: true
    },
    "enable": {
        name: "enable",
        alias: [],
        desc: "Re-allows execution of a command in a server.",
        args: {},
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
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [PermissionsBitField.Flags.ManageGuild],
            bot: []
        },
        unloadable: true
    },
    "disable": {
        name: "disable",
        alias: [],
        desc: "Disallows execution of a command within a server.",
        args: {},
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
                    let embed = new EmbedBuilder()
                    .setTitle("Disabled Commands")
                    .setDescription(list)
                    .setColor(host.color)
                    .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                    message.channel.send({embeds: [embed]})
                } else {
                    let cmd = client.commands.get(args.toLowerCase());
                    if(!cmd) return message.channel.send("This command wasn't found. Please use `" + config.guilds[message.guild.id].prefix + "help` to see the list of all commands.")
                    if(cmd.name == "enable" || cmd.name == "shutdown" || cmd.name == "eval") return message.channel.send("This command cannot be disabled.")
                    if(getTextInput(cmd.name, config.guilds[message.guild.id].disabled, 2)) return message.channel.send("This command has already been disabled.")
                    config.guilds[message.guild.id].disabled.push(args.toLowerCase());
                    message.channel.send("Okay, the command `" + args.toLowerCase() + "` is now disabled in this server.")
                }
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [PermissionsBitField.Flags.ManageGuild],
            bot: []
        },
        unloadable: true
    }
}

client.on('messageCreate', function(message) {
    if(warningStage[message.author.id] == 3) {
    warningStage[message.author.id] = 0;
    if(message.content.toLowerCase() == "cancel") return message.channel.send("Okay, I won't warn " + getPronouns(warnedUser[message.author.id], "them", 1) + ".")
    if(getTextInput(message.content, host.slurs) == true) return message.channel.send("Sorry, but I personally won't warn for any offensive reason.")
    if(message.content.length > 200) return message.channel.send("Sorry, but your reason is too long. Please shorten it.")
    config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].push(message.content)
    return message.channel.send("Okay, I've warned " + getPronouns(warnedUser[message.author.id], "them", 1) + " for \"" + message.content + "\".")
  } else if(warningStage[message.author.id] == 4) {
    if(message.content.toLowerCase() == "y" || message.content.toLowerCase() == "yes") {
      config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].splice(removeWarnNumber[message.author.id] - 1, 1)
      warningStage[message.author.id] = 0
      return message.channel.send("Okay, I've removed this warning from " + getPronouns(warnedUser[message.author.id], "them", 1) + ".")
    }
    warningStage[message.author.id] = 0;
    return message.channel.send("Okay, cancelling.")
  }
  if(warningStage[message.author.id] == 1) warningStage[message.author.id] = 3; // prevent warnings from the same message
  if(warningStage[message.author.id] == 2) warningStage[message.author.id] = 4; // otherwise automatically cancels
});

module.exports = commands;
for(item in commands) {
    commands[item].data = new SlashCommandBuilder().setName(commands[item].name).setDescription(commands[item].desc)
}
module.exports.info = "Moderation";
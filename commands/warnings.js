/* ========================================================================= *\
    Warnings: Precipitation module for warning server members
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

const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
    var find = require('./find.js').exports.find;
} catch(err) {
    log("find function could not be obtained - warning commands obsolete.", logging.warn, "warnings")
}

try {
    var name = require('./name.js').exports.name;
  } catch(err) {
    log("name function not found - defaulting to discord username only.", logging.warn, "warnings")
    function name(user) {
      return user.username;
    }
}

var warningStage = {};
var warnedUser = {};
var removeWarnNumber = {};

try {
  var gender = require('./gender.js').exports.gender;
} catch(err) {
  log("gender function not found - defaulting to \"them.\"", logging.warn, "warnings")
  function gender() {
    return "them";
  }
}

var commands = {
    "warn": {
        name: "warn",
        desc: "Warns a user.",
        args: "**(user)**",
        parameters: "",
        execute: {
            discord: function(message, args) {
                let user;
                if(args && find) {
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
                message.channel.send("Please give a reason for warning " + user.tag + " (" + name(user) + ").");
                warningStage[message.author.id] = 1;
            },
            slash: async function (interaction) {
                let user = interaction.options.getUser('user');
                if(!config.users[user.id]) config.users[user.id] = {};
                if(!config.guilds[interaction.guild.id].warnings) config.guilds[interaction.guild.id].warnings = {};
                if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
                if(config.guilds[interaction.guild.id].warnings[user.id].length > 9) return interaction.reply({ content: "Sorry, but Precipitation currently only supports up to 9 warnings per user.", ephemeral: true })
                warnedUser[interaction.user.id] = user;
                interaction.reply({ content: "Please give a reason for warning " + user.tag + " (" + name(user) + ")." })
                warningStage[interaction.user.id] = 3; // no messages involved
            }
        },
        ver: "3.0.0",
        cat: "Moderation",
        prereqs: {
            dm: false,
            owner: false,
            user: [ Permissions.FLAGS.MANAGE_NICKNAMES ],
            bot: []
        },
        unloadable: true
    },
    "lswarn": {
        name: "lswarn",
        desc: "See your current warnings, or see someone else's.",
        args: "(user)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                let user;
                let mUser;
                if(args && find) {
                    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return message.channel.send("You do not have permission to view another user's warnings.")
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
                    if(warnings.length == 0) return message.channel.send(user.username + " (" + name(user) + ") appears to have no warnings.")
                    let warningEmbed = new MessageEmbed()
                    .setTitle("Warnings List for " + user.tag)
                    .setColor(host.color)
                    .setFooter({ text: 'Precipitation ' + host.version.external })
                    for(let i = 0; i < warnings.length; i++) {
                    warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
                    }
                    return message.channel.send({embeds: [warningEmbed]})
                } else {
                    if(!config.users[message.author.id]) config.users[message.author.id] = {};
                    if(!config.guilds[message.guild.id].warnings[message.author.id]) config.guilds[message.guild.id].warnings[message.author.id] = [];
                    let warnings = config.guilds[message.guild.id].warnings[message.author.id];
                    if(warnings.length == 0) return message.channel.send("You appear to have no warnings.")
                    let warningEmbed = new MessageEmbed()
                    .setTitle("Warnings List for " + message.author.tag)
                    .setColor(host.color)
                    .setFooter({ text: 'Precipitation ' + host.version.external })
                    for(let i = 0; i < warnings.length; i++) {
                    warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
                    }
                    return message.channel.send({embeds: [warningEmbed]})
                }
            },
            slash: async function (interaction) {
                let user = interaction.options.getUser('user');
                if(!user) {
                    if(!config.users[interaction.user.id]) config.users[interaction.user.id] = {};
                    if(!config.guilds[interaction.guild.id].warnings[interaction.user.id]) config.guilds[interaction.guild.id].warnings[interaction.user.id] = [];
                    var warnings = config.guilds[interaction.guild.id].warnings[interaction.user.id];
                    if(warnings.length == 0) return interaction.reply({ content: "You appear to have no warnings.", ephermeral: true })
                    user = interaction.user;
                } else {
                    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return interaction.reply({ content: "You do not have permission to view another user's warnings.", ephemeral: true })
                    if(!config.users[user.id]) config.users[user.id] = {};
                    if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
                    var warnings = config.guilds[interaction.guild.id].warnings[user.id];
                    if(warnings.length == 0) return interaction.reply({ content: user.username + " (" + name(user) + ") appears to have no warnings.", ephermeral: true })
                }
                let warningEmbed = new MessageEmbed()
                .setTitle("Warnings List for " + user.tag)
                .setColor(host.color)
                .setFooter({ text: 'Precipitation ' + host.version.external })
                for(let i = 0; i < warnings.length; i++) {
                    warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
                }
                return interaction.reply({embeds: [warningEmbed]})
            }
        },
        ver: "3.0.0",
        cat: "Moderation",
        prereqs: {
            dm: false,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "rmwarn": {
        name: "rmwarn",
        desc: "Remove a warning from a user.",
        args: "**(warning id) (user)**",
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
                return message.channel.send("Removing warning #" + numArgs + " from " + removeUser.username + " (" + name(removeUser) + "). Are you sure?")
            },
            slash: async function (interaction) {
                let int = interaction.options.getInteger('id');
                let user = interaction.options.getUser('user');
                if(!config.users[user.id]) config.users[user.id] = {};
                if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
                if (int < 1 || int > config.guilds[interaction.guild.id].warnings[user.id].length) return interaction.reply({ content: "Please enter a valid number.", ephemeral: true })
                warnedUser[interaction.user.id] = user;
                warningStage[interaction.user.id] = 4; // no message involved
                removeWarnNumber[interaction.user.id] = int;
                return interaction.reply({ content: "Removing warning #" + int + " from " + user.username + " (" + name(user) + "). Are you sure?" })
            }
        },
        ver: "3.0.0",
        cat: "Moderation",
        prereqs: {
            dm: false,
            owner: false,
            user: [Permissions.FLAGS.MANAGE_NICKNAMES],
            bot: []
        },
        unloadable: true
    }
}

client.on('messageCreate', function(message) {
    if(warningStage[message.author.id] == 3) {
    warningStage[message.author.id] = 0;
    if(message.content.toLowerCase() == "cancel") return message.channel.send("Okay, I won't warn " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + ".")
    if(getTextInput(message.content, host.slurs) == true) return message.channel.send("Sorry, but I personally won't warn for any offensive reason.")
    if(message.content.length > 200) return message.channel.send("Sorry, but your reason is too long. Please shorten it.")
    config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].push(message.content)
    return message.channel.send("Okay, I've warned " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + " for \"" + message.content + "\".")
  } else if(warningStage[message.author.id] == 4) {
    if(message.content.toLowerCase() == "y" || message.content.toLowerCase() == "yes") {
      config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].splice(removeWarnNumber[message.author.id] - 1, 1)
      warningStage[message.author.id] = 0
      return message.channel.send("Okay, I've removed this warning from " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + ".")
    }
    warningStage[message.author.id] = 0;
    return message.channel.send("Okay, cancelling.")
  }
  if(warningStage[message.author.id] == 1) warningStage[message.author.id] = 3; // prevent warnings from the same message
  if(warningStage[message.author.id] == 2) warningStage[message.author.id] = 4; // otherwise automatically cancels
});

module.exports = commands;
commands["warn"].data = new SlashCommandBuilder().setName(commands["warn"].name).setDescription(commands["warn"].desc).addUserOption(option =>
    option.setName('user')
    .setDescription('The user to warn')
    .setRequired(true))
commands["lswarn"].data = new SlashCommandBuilder().setName(commands["lswarn"].name).setDescription(commands["lswarn"].desc).addUserOption(option =>
    option.setName('user')
    .setDescription('The user to see warnings of [requires Manage Nicknames]')
    .setRequired(false))
commands["rmwarn"].data = new SlashCommandBuilder().setName(commands["rmwarn"].name).setDescription(commands["rmwarn"].desc).addIntegerOption(int =>
    int.setName('id')
    .setDescription("Which warning to remove")
    .setRequired(true))
  .addUserOption(user =>
      user.setName('user')
      .setDescription('Which user to remove a warning from')
      .setRequired(true))
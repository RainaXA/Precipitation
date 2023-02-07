const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
    var name = require('./name.js').exports.name;
  } catch(err) {
    log("name function not found - defaulting to discord username only.", logging.warn, "uinfo")
    function name(user) {
      return user.username;
    }
}

try {
    var gender = require('./gender.js').exports.gender;
  } catch(err) {
    log("gender function not found - will display visible error.", logging.warn, "uinfo")
    function gender() {
      return "`gender()` 404";
    }
}

try {
    var find = require('./find.js').exports.find;
  } catch(err) {
    log("find function not found - will display message author.", logging.warn, "uinfo")
}

try {
    var toProperUSFormat = require('./birthday.js').exports.toProperUSFormat;
  } catch(err) {
    log("united states date format function not found - not showing birthday.", logging.warn, "uinfo")
}


try {
    var location = require('./location.js').exports.location;
} catch(err) {
    var location = null;
    log("location function not found - not showing location.", logging.warn, "uinfo")
}


var commands = {
    "uinfo": {
        name: "uinfo",
        desc: "Get information on a particular user.",
        args: "(user)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                let uinfoUser;
                if(args && find) {
                    uinfoUser = find(args.toLowerCase(), 1)
                    if(!uinfoUser) return message.channel.send("Couldn't find a user by that name.")
                } else {
                    uinfoUser = message.author;
                }
                let accDates = "**Creation Date**: " + uinfoUser.createdAt.toUTCString()
                let names = "**Username**: " + uinfoUser.username
                let birthday;
                if(config.users[uinfoUser.id].birthday) {
                    birthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
                } else {
                    birthday = "*not set*"
                }
                let setloc;
                if(config.users[uinfoUser.id].location && location) {
                    setloc = location(uinfoUser)
                } else {
                    setloc = "*not set*"
                }
                let botInfo = "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + birthday + "\n**Location**: " + setloc
                let uinfoMember;
                message.guild.members.cache.each(member => {
                    if(uinfoUser.id == member.id) {
                    return uinfoMember = member; // search all members in the guild and if they are in the guild, then display more results
                    }
                })
                if (uinfoMember) {
                    accDates = accDates + "\n**Join Date**: " + uinfoMember.joinedAt.toUTCString();
                    names = names + "\n**Display Name**: " + uinfoMember.displayName
                }
                let uinfo = new MessageEmbed()
                .setTitle("User Information || " + uinfoUser.tag)
                .addFields(
                    { name: "Account Dates", value: accDates, inline: true },
                    { name: "Names", value: names },
                    { name: "Bot Info", value: botInfo}
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                return message.channel.send({embeds: [uinfo]})
            },
            slash: async function (interaction) {
                let uinfoUser = interaction.options.getUser('user')
                if(!uinfoUser) uinfoUser = interaction.user;
                let accDates = "**Creation Date**: " + uinfoUser.createdAt.toUTCString()
                let names = "**Username**: " + uinfoUser.username
                if(config.users[uinfoUser.id].birthday) {
                    birthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
                } else {
                    birthday = "*not set*"
                }
                let setloc;
                if(config.users[uinfoUser.id].location && location) {
                    setloc = location(uinfoUser)
                } else {
                    setloc = "*not set*"
                }
                let botInfo = "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + birthday + "\n**Location**: " + setloc
                let uinfoMember;
                interaction.guild.members.cache.each(member => {
                    if(uinfoUser.id == member.id) {
                    return uinfoMember = member; // search all members in the guild and if they are in the guild, then display more results
                    }
                })
                if (uinfoMember) {
                    accDates = accDates + "\n**Join Date**: " + uinfoMember.joinedAt.toUTCString();
                    names = names + "\n**Display Name**: " + uinfoMember.displayName
                }
                let uinfo = new MessageEmbed()
                .setTitle("User Information || " + uinfoUser.tag)
                .addFields(
                    { name: "Account Dates", value: accDates, inline: true },
                    { name: "Names", value: names },
                    { name: "Bot Info", value: botInfo}
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                return interaction.reply({embeds: [uinfo]})
            }
        },
        ver: "3.0.0",
        cat: "Moderation",
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
        desc: "Get information on the server.",
        args: "",
        parameters: "",
        execute: {
            discord: function(message, args) {
                let embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .addField("Dates", "**Created**: " + message.guild.createdAt.toUTCString() + "\n**Precipitation Joined**: " + message.guild.joinedAt.toUTCString())
                .addField("Members", "**Member Count**: " + message.guild.memberCount + "\n**Server Owner**: <@" + message.guild.ownerId + ">")
                .addField("Misc.", "**Boosts:** " + message.guild.premiumSubscriptionCount)
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                message.channel.send({embeds: [embed]})
            },
            slash: async function (interaction) {
                let embed = new MessageEmbed()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .addField("Dates", "**Created**: " + interaction.guild.createdAt.toUTCString() + "\n**Precipitation Joined**: " + interaction.guild.joinedAt.toUTCString())
                .addField("Members", "**Member Count**: " + interaction.guild.memberCount + "\n**Server Owner**: <@" + interaction.guild.ownerId + ">")
                .addField("Misc.", "**Boosts:** " + interaction.guild.premiumSubscriptionCount)
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                await interaction.reply({embeds: [embed]})
            }
        },
        ver: "3.0.0",
        cat: "General",
        prereqs: {
            dm: false,
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
commands["uinfo"].data = new SlashCommandBuilder().setName(commands["uinfo"].name).setDescription(commands["uinfo"].desc).addUserOption(user =>
    user.setName('user')
    .setDescription('Which user to get information'))
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
  var name = require('./name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "UINFO")
  function name(user) {
    return user.username;
  }
}

try {
  var gender = require('./gender.js').gender;
} catch(err) {
  log("Gender function could not be obtained. Defaulting to basic gender function.", logging.warn, "UINFO")
  function gender() {
    return "*not set*";
  }
}

try {
  var find = require('./find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will only show message author.", logging.warn, "UINFO")
}

try {
  var toProperUSFormat = require('./birthday.js').toProperUSFormat;
} catch(err) {
  log("US Format function could not be obtained. Command will not properly show birthday.", logging.warn, "UINFO")
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uinfo')
        .setDescription('Get information on a particular user.')
        .addUserOption(user =>
            user.setName('user')
            .setDescription('Which user to get information')),
};

let uinfoUser;
module.exports.prereq = async(type, uni, args) => {
  uinfoUser = null;
  if(type == types.slash && find) {
    uinfoUser = uni.options.getUser('user')
    if(!uinfoUser) uinfoUser = uni.user;
  } else if(args && find) {
    uinfoUser = find(args.toLowerCase(), 1)
    if(!uinfoUser) return uni.channel.send("Couldn't find a user by that name.")
  } else {
    uinfoUser = uni.author;
  }
  if(!config.users[uinfoUser.id]) config.users[uinfoUser.id] = {}
}

module.exports.default = async (message, args, parameter) => {
  let accDates = "**Creation Date**: " + uinfoUser.createdAt.toUTCString()
  let names = "**Username**: " + uinfoUser.username
  let birthday;
  if(config.users[uinfoUser.id].birthday) {
    birthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
  } else {
    birthday = "*not set*"
  }
  let botInfo = "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + birthday
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
  .setColor(host.colors[branch])
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  return message.channel.send({embeds: [uinfo]})
}

module.exports.slash = async (interaction) => {
  let accDates = "**Creation Date**: " + uinfoUser.createdAt.toUTCString()
  let names = "**Username**: " + uinfoUser.username
  if(config.users[uinfoUser.id].birthday) {
    birthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
  } else {
    birthday = "*not set*"
  }
  let botInfo = "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + birthday
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
  .setColor(host.colors[branch])
  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
  return interaction.reply({embeds: [uinfo]})
}

module.exports.help = {
    name: "uinfo",
    desc: "Get information on a particular user.",
    args: "(user)",
    parameters: "",
    category: "Moderation",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": true,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true
}

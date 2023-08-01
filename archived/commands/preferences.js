/* ========================================================================= *\
    Config: Precipitation command to change server configurations
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

const { Permissions, MessageEmbed, MessageActionRow, MessageSelectMenu, TextInputComponent } = require('discord.js')
//const { SlashCommandBuilder } = require('@discordjs/builders');

let settingButton = {};
let currentMessage = {};

function name(user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
      return config.users[user.id].name
  }
}

function pronouns (user, naMessage, returnPronoun) { // 0 = subject, 1 = object, 2 = possessive, 3 = reflexive (she/her/hers/herself)
  if(!config.users[user.id].pronouns) return naMessage;
  if(!returnPronoun) return config.users[user.id].pronouns; // return full list if no desired returnPronoun
  return config.users[user.id].pronouns.split("/")[returnPronoun];
};

var commands = {
  "preferences" : {
    name: "preferences",
    alias: ["pref"],
    desc: "Changes user settings, such as name or pronouns.",
    args: {
      "setting": {
        "desc": "Which setting to change",
        "required": true
      },
      "option": {
        "desc": "What to change the setting to",
        "required": true
      }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
          if(!config.users[message.author.id]) config.users[message.author.id] = {};
          let cArg = args.split(" ")
          //if(!cArg[1] && cArg[0]) return message.channel.send("Please add another argument.")
          switch(cArg[0].toLowerCase()) {
              case "name":
                let nameArgs = args.slice(cArg[0].length + 1);
                if(nameArgs.length >= 75) return nameArgs.channel.send("That's too long of a name.")
                if((nameArgs.includes("<@") && args.includes(">")) || nameArgs.includes("@everyone") || nameArgs.includes("@here")) return message.channel.send("I won't ping anyone.")
                if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
                if(nameArgs.includes("\n")) return message.channel.send("Please keep your name inside of one line.")
                if(nameArgs == "") {
                    config.users[message.author.id].name = null;
                    return message.channel.send("Sure, I'll refer to you by your username.")
                }
                config.users[message.author.id].name = nameArgs;
                return message.channel.send("Sure, I'll refer to you by \"" + nameArgs + "\".")
              case "pronouns": 
                let noArgs = "You must have four arguments containing your preferred pronouns. In order, it must be `subject/object/possessive/reflexive`.\n\nFor example, `he/him/his/himself`, `she/her/hers/herself`, or `they/them/theirs/themself`."
                let aargs = args.split("/")
                if(!aargs[3] || aargs[4]) {
                  return message.channel.send(noArgs);
                } else { // do some checks for bad shit
                  if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Your pronouns cannot involve pinging others.")
                  if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
                  if(args.includes("\n")) return message.channel.send("Please keep your pronouns inside of one line.")
                  if(aargs[0].length >= 10) return message.channel.send("Your subject pronoun needs to be kept below 10 characters.")
                  if(aargs[1].length >= 10) return message.channel.send("Your object pronoun needs to be kept below 10 characters.")
                  if(aargs[2].length >= 10) return message.channel.send("Your possessive pronoun needs to be kept below 10 characters.")
                  if(aargs[3].length >= 15) return message.channel.send("Your reflexive pronoun needs to be kept below 15 characters.")
                  if(aargs[0].length == 0 || aargs[1].length == 0 || aargs[2].length == 0 || aargs[3].length == 0) return message.channel.send(noArgs);
                  config.users[message.author.id].pronouns = args;
                  return message.channel.send("From now on, I will now refer to you using the pronouns " + args + ".")
                }
              default:
                let configuration = new MessageEmbed()
                .setTitle("User Preferences || " + message.author.tag)
                .addFields(
                  { name: "Preferred Name (name)", value: name(message.author) },
                  { name: "Preferred Pronouns (pronouns)", value: pronouns(message.author, "*not set*") },
                  { name: "Birthday (birthday)", value: "WIP!" },
                  { name: "Location (location)", value: "WIP!" },
                  { name: "Timezone (timezone)", value: "WIP!"},
                  { name: "Color (color)", value: "WIP!" }
                )
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                /*let row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu() 
                        .setCustomId('select')
                        .setPlaceholder('Select a server option to change...')
                        .addOptions([
                          { label: "Prefix", description: "Changes the prefix that Precipitation listens for in this server.", value: "Prefix" },
                          { label: "Slur Filter", description: "Changes whether or not Precipitation will delete messages containing slurs.", value: "Slur Filter" },
                          { label: "Message Logging", description: "Changes where Precipitation logs edited and deleted messages.", value: "Message Logging" },
                          { label: "Member Logging", description: "Changes where Precipitation logs arriving and departing members.", value: "Member Logging" },
                          { label: "I HATE UPDOG", description: "Changes whether or not Precipitation gets upset when anyone says updog.", value: "I HATE UPDOG" }
                        ])
                );*/
                return message.channel.send({embeds: [configuration]});
          }
        }
    },
    ver: "3.2.0",
    cat: "Personalization",
    prereqs: {
        dm: false,
        owner: false,
        user: [Permissions.FLAGS.MANAGE_GUILD],
        bot: [Permissions.FLAGS.MANAGE_MESSAGES]
    },
    unloadable: true
  }
}

module.exports = commands;
module.exports.exports = {};
module.exports.exports.name = name; // export
module.exports.exports.pronouns = pronouns; // export

client.on('interactionCreate', interaction => { 
  if (!interaction.isSelectMenu()) return;
  if (settingButton[interaction.message.id] != interaction.user.id) return;
  interaction.update({
      components: interaction.components
  }).then(m => {
      let option = interaction.values[0];
      let value = "Undefined Value";
      switch(option) {
        case "Prefix":
          value = config.guilds[interaction.guild.id].prefix;
          break;
        case "Slur Filter":
          value = String(config.guilds[interaction.guild.id].settings.filter).replace("false", "Disabled").replace("true", "Enabled").replace("undefined", "Disabled");
          break;
        case "Message Logging":
          value = String(config.guilds[interaction.guild.id].settings.logging.messages).replace("null", "Disabled").replace("undefined", "Disabled");
          break;
        case "Member Logging":
          value = String(config.guilds[interaction.guild.id].settings.logging.members).replace("null", "Disabled").replace("undefined", "Disabled");
          break;
        case "I HATE UPDOG":
          value = String(config.guilds[interaction.guild.id].settings.updog).replace("false", "Disabled").replace("undefined", "Disabled").replace("true", "Enabled");
          break;
      }
      let configuration = new MessageEmbed()
      .setTitle("Server Configuration || " + interaction.guild.name + " >> " + option)
      .addFields({ name: "Current Value", value: value })
      .setColor(host.color)
      .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
      /*let rowa = new MessageActionRow() produces fucking stupid error
        .addComponents(
          new TextInputComponent() 
            .setCustomId('newOption')
            .setPlaceholder('Hmm')
            .setLabel("How's it looking?")
            .setStyle("SHORT")
        )*/
        return currentMessage[interaction.user.id].edit({embeds: [configuration], /*components: [rowa]*/})
  });
});

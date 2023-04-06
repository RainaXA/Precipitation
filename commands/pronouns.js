/* ========================================================================= *\
    Pronouns: Precipitation command to set preferred pronouns
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
const { MessageButton, MessageActionRow } = require('discord.js')

let settingButton = {};
let currentMessage = {};
var command = {
    name: "pronouns",
    alias: ["gender"],
    desc: "Sets the preferred pronouns for the bot to refer to you as.",
    args: {
      "pronouns": {
        "desc": "What pronouns for the bot to refer to you as",
        "required": false
      }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
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
          if (!cmdGender) {
            let genders = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('male')
                  .setLabel('Male [he/him]')
                  .setStyle('PRIMARY'),
                new MessageButton()
                  .setCustomId('female')
                  .setLabel('Female [she/her]')
                  .setStyle('PRIMARY'),
                new MessageButton()
                  .setCustomId('other')
                  .setLabel('Other [they/them]')
                  .setStyle('PRIMARY'),
              );
            message.channel.send({ content: "Please select a gender.", components: [genders] }).then(m => {
              settingButton[m.id] = message.author.id;
              currentMessage[message.author.id] = m;
            })
          }
          config.users[message.author.id].gender = cmdGender;
        },
        slash: async function (interaction) {
          let args = {
            subject: interaction.options.getString('subject'),
            object: interaction.options.getString('object'),
            possessive: interaction.options.getString('possessive'),
            reflexive: interaction.options.getString('reflexive')
          }
          for(pronoun in args) {
            if((args[pronoun].includes("<@") && args[pronoun].includes(">")) || args[pronoun].includes("@everyone") || args[pronoun].includes("@here")) return interaction.reply({ content: "Your " + pronoun + " pronoun cannot involve pinging others.", ephemeral: true })
            if(getTextInput(args[pronoun], host.slurs)) return interaction.reply({ content: "Hey, I'm not going to yell out offensive words.", ephemeral: true })
            if(args[pronoun].length >= 10 && pronoun != "reflexive") {
              return interaction.reply({ content: "Your " + pronoun + " pronoun needs to be kept below 10 characters.", ephemeral: true })
            } else if (args[pronoun].length >= 15) {
              return interaction.reply({ content: "Your reflexive pronoun needs to be kept below 15 characters.", ephemeral: true })
            }
          }
          let pronouns = args.subject + "/" + args.object + "/" + args.possessive + "/" + args.reflexive
          config.users[interaction.user.id].pronouns = pronouns;
          interaction.reply({ content: "From now on, I will now refer to you using the pronouns " + pronouns + "." })
        }
    },
    ver: "3.2.0",
    cat: "Personalization",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}
sw
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
  if (settingButton[interaction.message.id] != interaction.user.id) return;
  interaction.component.setStyle("SUCCESS");
  interaction.update({
    components: [
      new MessageActionRow().addComponents(interaction.component)
    ]
  }).then(m => {
    currentMessage[interaction.user.id].edit("Your gender has been set.")
    config.users[interaction.user.id].gender = interaction.customId;
  });
});

module.exports = command;
module.exports.exports = {};
module.exports.exports.pronouns = function(user, naMessage, returnPronoun) { // 0 = subject, 1 = object, 2 = possessive, 3 = reflexive (she/her/hers/herself)
  if(!config.users[user.id].pronouns) return naMessage;
  if(!returnPronoun) return config.users[user.id].pronouns; // return full list if no desired returnPronoun
  return config.users[user.id].pronouns.split("/")[returnPronoun];
};

module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addStringOption(option =>
  option.setName('subject')
  .setDescription('Which subject pronoun (examples: he, she, they)')
  .setRequired(true))
  .addStringOption(option =>
    option.setName('object')
    .setDescription('Which object pronoun (examples: him, her, them)')
    .setRequired(true))
  .addStringOption(option =>
    option.setName('possessive')
    .setDescription('Which possessive pronoun (examples: his, hers, theirs)')
    .setRequired(true))
  .addStringOption(option =>
    option.setName('reflexive')
    .setDescription('Which reflexive pronoun (examples: himself, herself, themself)')
    .setRequired(true))
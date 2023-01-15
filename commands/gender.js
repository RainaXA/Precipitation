const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow } = require('discord.js')

let settingButton = {};
let currentMessage = {};
var command = {
    name: "gender",
    desc: "Sets the gender for the bot to refer to you as.",
    args: "(male | female | other)",
    parameters: "",
    execute: {
        discord: function(message, args) {
          let cmdGender;
          switch(args.toLowerCase()) {
            case "female":
            case "she/her":
            case "f":
              cmdGender = "female";
              break;
            case "male":
            case "he/him":
            case "m":
              cmdGender = "male";
              break;
            case "other":
            case "they/them":
            case "o":
              cmdGender = "other";
              break;
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
          } else {
            message.channel.send({ content: "Sure, I'll refer to you as " + cmdGender + "."})
          }
          config.users[message.author.id].gender = cmdGender;
        },
        slash: async function (interaction) {
          let arg = interaction.options.getString('gender');
          config.users[interaction.user.id].gender = arg;
          interaction.reply({ content: "Sure, I'll refer to you as " + arg + "." })
        }
    },
    ver: "3.0.0",
    cat: "Personalization",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

client.on('interactionCreate', interaction => { // receive button input from line 78
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
module.exports.exports.gender = function(user, mMessage, fMessage, oMessage, naMessage) {
  switch(config.users[user.id].gender) {
    case "male":
      return mMessage;
    case "female":
      return fMessage;
    case "other":
      return oMessage;
    default:
      return naMessage;
  }
};
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addStringOption(option =>
  option.setName('gender')
  .setDescription('Which gender?')
  .setRequired(true)
  .addChoice("Male [he/him]", "male")
  .addChoice("Female [she/her]", "female")
  .addChoice("Other [they/them]", "other"))
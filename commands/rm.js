const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rm')
        .setDescription('Bulk delete messages.')
        .addIntegerOption(option =>
            option.setName('remove')
            .setDescription('Delete x amount of messages. [between 1-99]')
            .setRequired(true)),
};

module.exports.default = async (message, args, parameter) => {
  if(parseInt(args) == 0) return message.channel.send("Okay, I didn't delete any messages.")
  if(parseInt(args) > 99 || parseInt(args) < 0) return message.channel.send("Please keep your number between 1-99.")
  try {
    if(parseInt(args) == 1) {
      return message.channel.bulkDelete(2, { filterOld: true }).then(messages => {
        message.channel.send("Okay, I've deleted the above message. (really?)") // it's funny
      })
    }
    return message.channel.bulkDelete(parseInt(args) + 1, { filterOld: true }).then(messages => {
      if(parseInt(args) + 1 == messages.size) {
        message.channel.send("Okay, I've deleted " + args + " messages.")
      } else {
        message.channel.send("Unfortunately, due to Discord limitations, I could only delete " + messages.size + " messages.")
      }
    })
  } catch (err) {
    message.channel.send("Due to a fatal error, the messages could not be deleted.")
  }
}

module.exports.slash = async (interaction) => {
  let int = interaction.options.getInteger('remove');
  if(int == 0) return interaction.reply({ content: "Okay, I didn't delete any messages." })
  if(int > 99 || int < 0) return interaction.reply({ content: "Please keep your number between 1-99.", ephemeral: true })
  try {
    if(int == 1) {
      return interaction.channel.bulkDelete(1, {filterOld: true}).then(messages => {
        interaction.reply({ content: "Okay, I've deleted the above message. (really?)" })
      })
    }
    return interaction.channel.bulkDelete(int, {filterOld: true}).then(messages => {
      if (messages.size == int) {
        interaction.reply({ content: "Okay, I've deleted " + int + " messages." })
      } else {
        interaction.reply({ content: "Some of these messages are over two weeks old (or an interaction) - I could only delete " + messages.size + " messages." })
      }
    })
  } catch(err) {
    interaction.reply({ content: "Due to a fatal error, I couldn't delete any messages.", ephemeral: true })
  }
}

module.exports.help = {
    name: "rm",
    desc: "Bulk delete messages.",
    args: "**(number, 1-99)**",
    parameters: "",
    category: "Moderation",
}

module.exports.metadata = {
    allowDM: false,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": true,
      "console": false
    },
    permissions: {
      "user": [ Permissions.FLAGS.MANAGE_MESSAGES ],
      "bot": [ Permissions.FLAGS.MANAGE_MESSAGES ]
    },
    unloadable: true,
    requireOwner: false
}

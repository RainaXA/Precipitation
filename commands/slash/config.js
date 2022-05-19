const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Changes server-specific properties.')
        .addStringOption(option =>
            option.setName('prefix')
            .setDescription('Change which prefix the bot will respond to outside of slash commands'))
        .addBooleanOption(option =>
            option.setName('filter')
            .setDescription('Switch whether or not the bot will censor')),
    async execute(interaction) {
      let { Permissions, MessageEmbed } = require('discord.js')
      if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return interaction.reply({ content: "You don't have the proper permissions to perform this action.", ephemeral: true })
      let prefix = interaction.options.getString('prefix')
      let filter = interaction.options.getBoolean('filter')
      let donePrefix = false;
      let message = "";
      if(prefix) {
        if(getTextInput(prefix)) return message.channel.send("Maybe set a prefix that's a little less offensive?")
        config.guilds[interaction.guild.id].prefix = prefix
        message += "I've set the server prefix to `" + prefix + "`."
        donePrefix = true
      }
      if(filter == true) {
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: "I don't have the permissions to delete messages, so I won't turn on the filter.", ephemeral: true })
        config.guilds[interaction.guild.id].filter = true;
        if(donePrefix) {
          message += " I've also set the filter to `true`."
        } else {
          message += "I've set the filter to `true`."
        }
      } else if(filter == false) {
        config.guilds[interaction.guild.id].filter = false;
        if(donePrefix) {
          message += " I've also set the filter to `false`."
        } else {
          message += "I've set the filter to `false`."
        }
      }
      interaction.reply({ content: message })
    }
};

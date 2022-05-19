const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lswarn')
        .setDescription('See your current warnings, or see someone else\'s.')
        .addUserOption(user =>
            user.setName('user')
            .setDescription('Which user to list warnings (requires Manage Nicknames)')),
    async execute(interaction) {
      let { Permissions, MessageEmbed } = require('discord.js')
      let user = interaction.options.getUser('user');
      if(!user) {
        let warnings = config.guilds[interaction.guild.id].warnings[interaction.user.id];
        if(warnings == undefined || warnings.length == 0) return interaction.reply({ content: "You have no warnings.", ephermeral: true })
        let warningEmbed = new MessageEmbed()
        .setTitle("Warnings List for " + interaction.user.tag)
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version.external })
        for(let i = 0; i < warnings.length; i++) {
          warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
        }
        return interaction.reply({embeds: [warningEmbed]})
      } else {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return interaction.reply({ content: "You don't have the required permissions to perform this action.", ephemeral: true })
        let warnings = config.guilds[interaction.guild.id].warnings[user.id];
        if(warnings == undefined || warnings.length == 0) return interaction.reply({ content: "This user has no warnings.", ephermeral: true })
        let warningEmbed = new MessageEmbed()
        .setTitle("Warnings List for " + user.tag)
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version.external })
        for(let i = 0; i < warnings.length; i++) {
          warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
        }
        return interaction.reply({embeds: [warningEmbed]})
      }
    }
};

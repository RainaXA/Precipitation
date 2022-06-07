const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rmwarn')
        .setDescription('Remove a warning from a user')
        .addIntegerOption(int =>
          int.setName('id')
          .setDescription("Which warning to remove")
          .setRequired(true))
        .addUserOption(user =>
            user.setName('user')
            .setDescription('Which user to remove a warning from')
            .setRequired(true)),
    async execute(interaction) {
      let { Permissions } = require('discord.js')
      let int = interaction.options.getInteger('id');
      let user = interaction.options.getUser('user');
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) interaction.reply({ content: "You don't have the required permissions to perform this action.", ephemeral: true })
      if (int < 1 || int > config.guilds[interaction.guild.id].warnings[user.id].length) interaction.reply({ content: "Please enter a valid number.", ephemeral: true })
      warnedUser[interaction.user.id] = user;
      warningStage[interaction.user.id] = 4; // no message involved
      removeWarnNumber[interaction.user.id] = int;
      return interaction.reply({ content: "Removing warning #" + int + " from " + user.username + ". Are you sure?" })
    }
}

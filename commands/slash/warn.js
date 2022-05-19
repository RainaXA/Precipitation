const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(user =>
            user.setName('user')
            .setDescription('Which user to warn')
            .setRequired(true)),
    async execute(interaction) {
      let { Permissions } = require('discord.js')
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return interaction.reply({ content: "You don't have the required permissions to perform this action.", ephemeral: true })
      let user = interaction.options.getUser('user');
      if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
      if(config.guilds[interaction.guild.id].warnings[user.id].length > 9) return interaction.reply({ content: "Sorry, but Precipitation currently only supports up to 9 warnings. (this is because of lswarn...things will get spammy without pages real fast.)", ephemeral: true })
      warnedUser[interaction.user.id] = user;
      interaction.reply({ content: "Please give a reason for warning " + user.tag + " (" + name(user) + ")." })
      warningStage[interaction.user.id] = 3; // no messages involved
    }
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gender')
        .setDescription('Sets the gender for the bot to refer to you as.')
        .addStringOption(option =>
            option.setName('gender')
            .setDescription('Which gender?')
            .setRequired(true)
            .addChoice("Male [he/him]", "male")
            .addChoice("Female [she/her]", "female")
            .addChoice("Other [they/them]", "other")),
    async execute(interaction) {
        let arg = interaction.options.getString('gender');
        config.users[interaction.user.id].gender = arg;
        interaction.reply({ content: "Sure, I'll refer to you as " + arg + "." })
    }
};

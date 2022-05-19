const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Shows the current bot version.')
        .addBooleanOption(option =>
            option.setName('--show-internal')
            .setDescription('Show the internal bot version rather than the external.')
            .setRequired(false)),
    async execute(interaction) {
        let parameter = interaction.options.getBoolean('--show-internal');
        if(parameter) return interaction.reply({ content: "Precipitation " + version.internal });
        interaction.reply({ content: "Precipitation " + version.external })
    }
};

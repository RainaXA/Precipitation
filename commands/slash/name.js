const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('Sets the name for the bot to refer to you as.')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Set the name for the bot to refer to you as.')
            .setRequired(false)),
    async execute(interaction) {
        let arg = interaction.options.getString('name');
        if(!arg) {
            config.users[interaction.user.id].name = null;
            interaction.reply({ content: "Sure, I'll refer to you by your username." });
        } else {
            if(arg.length >= 75) return interaction.reply({ content: "That's too long of a name.", ephemeral: true })
            if((arg.includes("<@") && arg.includes(">")) || arg.includes("@everyone") || arg.includes("@here")) return interaction.reply({ content: "I won't ping anyone.", ephemeral: true })
            if(getTextInput(arg)) return interaction.reply({ content: "Hey, I'm not going to yell out offensive words.", ephemeral: true })
            config.users[interaction.user.id].name = arg;
            return interaction.reply({ content: "Sure, I'll refer to you by \"" + name(interaction.user) + "\"." })
        }
    }
};

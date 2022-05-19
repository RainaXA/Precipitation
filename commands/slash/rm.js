const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rm')
        .setDescription('Bulk delete messages.')
        .addIntegerOption(option =>
            option.setName('remove')
            .setDescription('Delete x amount of messages. [between 1-99]')
            .setRequired(true)),
    async execute(interaction) {
        let int = interaction.options.getInteger('remove');
        const { Permissions } = require('discord.js')
        if(int == 0) return interaction.reply({ content: "Okay, I didn't delete any messages." })
        let purgeList = "Please:\n";
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) purgeList = purgeList + "- ensure you have permissions\n"
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) purgeList = purgeList + "- ensure I have permissions\n"
        if(int > 99) purgeList = purgeList + "- ensure the number you've input is between 1-99."
        if(purgeList == "Please:\n") {
            if(int == 1) {
                return interaction.channel.bulkDelete(1).then(() => {
                    interaction.reply({ content: "Okay, I've deleted the above message. (really?)" })
                })
            }
            return interaction.channel.bulkDelete(int).then(() => {
                interaction.reply({ content: "Okay, I've deleted " + int + " messages." })
            })
        }
        return interaction.reply({ content: purgeList, ephemeral: true })
    }
};

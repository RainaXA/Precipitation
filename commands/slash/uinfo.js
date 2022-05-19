const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uinfo')
        .setDescription('Get information on a particular user.')
        .addUserOption(user =>
            user.setName('user')
            .setDescription('Which user to see')),
    async execute(interaction) {
        let user = interaction.options.getUser('user')
        let member = interaction.options.getMember('member')
        let { MessageEmbed } = require('discord.js')
        initUser(user)
        let userBirthday;
        if(config.users[user.id].birthday.month == undefined) {
            userBirthday = "*not set*"
        } else {
            userBirthday = toProperUSFormat(config.users[user.id].birthday.month, config.users[user.id].birthday.day, config.users[user.id].birthday.year)
        }
        let uinfo = new MessageEmbed()
        .setTitle("User Information || " + user.tag)
        .addFields(
            { name: "Account Dates", value: "**Creation Date**: " + user.createdAt.toUTCString(), inline: true },
            { name: "Names", value: "**Username**: " + user.username },
            { name: "Bot Info", value: "**Name**: " + name(user) + "\n**Gender**: " + gender(user, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + userBirthday }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version.external });
        return interaction.reply({embeds: [uinfo]})
    }
};

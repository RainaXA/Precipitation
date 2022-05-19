const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the current latency of the bot.'),
    async execute(interaction) {
        let pingMessages = ["Pinging...", "Ponging...", "Hacking the mainframe...",  "Going bowling with Roman...", "Trying to become funny...", "Making more ping messages...", "who's joe", "pay my onlyfans", "doin ya mom", "living the american dream", "don't care + didn't ask", "ooh, ee, ooh ah ah, ting tang, wallawallabingbang", "I TOLD THE WITCH DOCTOR I WAS IN LOVE WITH YOU", "will the real slim shady please stand up", "Telling the witch doctor I was in love with you...", "i think i'm going insane", "Expressing myself...", "omg, you're a redditor AND a discord mod?", "i use arch btw", "I've come to make an announcement", "CLARA", "jett rebibe me", "police crash green screen", "apparently i committed tax fraud but idk how that happened, i dont even pay tax????"];
        let raelynnTooCute = Math.floor(Math.random() * pingMessages.length)
        let startTime = Date.now()
        await interaction.reply({ content: "<:ping_receive:502755206841237505> " + pingMessages[raelynnTooCute] })
        await interaction.editReply({ content: "<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + name(interaction.user) + "!" })
    }
};

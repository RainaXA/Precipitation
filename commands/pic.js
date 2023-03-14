const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
    var find = require('./find.js').exports.find;
  } catch(err) {
    log("find function not found - only showing message author.", logging.warn, "pic")
}

var command = {
    name: "pic",
    desc: "Gets the profile picture of yourself or another user.",
    args: "",
    parameters: "",
    execute: {
        discord: function(message, args) {
            let user;
            if(args && find) user = find(args.toLowerCase(), 1);
            if(!user) user = message.author
            let embed = new MessageEmbed()
            .setTitle(user.tag + "'s Profile Picture")
            .setImage(user.displayAvatarURL())
            .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
            .setColor(host.color)
            message.channel.send({embeds: [embed]})
        },
        slash: async function (interaction) {
            let user = interaction.options.getUser('user');
            if(!user) user = interaction.user;
            let embed = new MessageEmbed()
            .setTitle(user.tag + "'s Profile Picture")
            .setImage(user.displayAvatarURL())
            .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
            .setColor(host.color)
            await interaction.reply({ embeds: [embed] })
        }
    },
    ver: "3.0.0",
    cat: "General",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addUserOption(user =>
    user.setName('user')
    .setDescription("Who to get the profile picture of"))
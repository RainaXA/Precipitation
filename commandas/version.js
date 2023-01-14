const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

var logs = require("../data/changelogs.json")

var command = {
    name: "version",
    desc: "Shows the current bot version.",
    args: "(version)",
    parameters: "[--internal]",
    execute: {
        discord: function(message, args, parameter) {
            if(parameter.toLowerCase() == "internal") return message.channel.send("Precipitation " + host.version.internal)
            if(args) {
                let changelog = logs.numerical[args]
                if(!changelog) changelog = logs.versionName[args.toLowerCase()]
                if(!changelog) return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
                if(changelog == logs.versionName[args.toLowerCase()]) {
                let embed = new MessageEmbed()
                .setTitle(changelog.name)
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                for(change in changelog.changes) {
                    embed.addField(change, changelog.changes[change])
                }
                return message.channel.send({embeds:[embed]});
                } else {
                let embed = new MessageEmbed()
                .setTitle(changelog.name)
                .addField("Changes", changelog.changes)
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                return message.channel.send({embeds:[embed]});
                }
            }
            return message.channel.send("Precipitation " + host.version.external + " " + host.version.name);
        },
        slash: async function (interaction) {
            await interaction.reply({ content: "Precipitation " + host.version.external + " " + host.version.name + " (" + host.version.internal + ")" })
        },
        console: function() {
            log("internal: " + host.version.internal + "\nexternal: " + host.version.external + "\nname: " + host.version.name, logging.output, "version")
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
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc)
/* ========================================================================= *\
    Version: Precipitation command to show the version of the bot
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

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
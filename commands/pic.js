/* ========================================================================= *\
    Pictures: Precipitation command to get the profile picture of a specified user
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

try {
    var find = require('./find.js').exports.find;
  } catch(err) {
    log("find function not found - only showing message author.", logging.warn, "pic")
}

var command = {
    name: "pic",
    alias: ["pfp", "avatar"],
    desc: "Gets the profile picture of yourself or another user.",
    args: {
        "user": {
            "desc": "The user to get the profile picture of",
            "required": false
        }
    },
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
    ver: "3.2.0",
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
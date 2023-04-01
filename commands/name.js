/* ========================================================================= *\
    Name: Precipitation command to set a preferred name
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

const { SlashCommandBuilder } = require('@discordjs/builders');

try {
    var gender = require('./gender.js').exports.gender;
  } catch(err) {
    log("gender function not found - will display visible error.", logging.warn, "uinfo")
    function gender() {
      return "`gender()` 404";
    }
}

var command = {
    name: "name",
    desc: "Sets the name for the bot to refer to you as.",
    args: {
        "name": {
            "desc": "The text to set as a preferred name",
            "required": false
        }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
            if(args.length >= 75) return message.channel.send("You liberals and your stupidly long names. Make it shorter.")
            if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("You have your First Amendment rights to do that pingin' all you want, but you'd better get and not have me do that.")
            if(getTextInput(args, host.slurs)) return message.channel.send("Ayyyy, " + gender(message.author, "brother", "sister", "patriot", "patriot") + "! I'm sorry but Raina would kill me if I said one of them words. Glad you had the courage to stand up against the liberal agenda of silencing our First Amendment rights, however.")
            if(args.includes("\n")) return message.channel.send("You liberals and your WEIRD names. Just use one line.")
            if(args == "") {
                config.users[message.author.id].name = null;
                return message.channel.send("I'll call you by whatever that them there thing says.")
            }
            config.users[message.author.id].name = args;
            return message.channel.send("I hope you're not one of them there transgendereds, like Raina. However, I have to call you that anyways.")
        },
        slash: async function (interaction) {
            let string = interaction.options.getString('name')
            if(!string) {
                config.users[interaction.user.id].name = null;
                return interaction.reply({ content: "Sure. I'll refer to you by your username." })
            }
            if(string.length >= 75) return interaction.reply({ content: "That's too long of a name.", ephemeral: true })
            if((string.includes("<@") && string.includes(">")) || string.includes("@everyone") || string.includes("@here")) return interaction.reply({ content: "I won't ping anyone.", ephemeral: true })
            if(getTextInput(string, host.slurs)) return interaction.reply({ content: "Hey, I'm not going to yell out offensive words.", ephemeral: true })
            config.users[interaction.user.id].name = string;
            return interaction.reply({ content: "Sure, I'll refer to you by \"" + string + "\"." })
        }
    },
    ver: "3.1.0",
    cat: "Personalization",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.exports = {};
module.exports.exports.name = function (user) {
    if(!config.users[user.id].name) {
      return user.username
    } else {
        return config.users[user.id].name
    }
}; // export
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addStringOption(option =>
    option.setName('name')
    .setDescription(command.args["name"].desc)
    .setRequired(false))

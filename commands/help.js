/* ========================================================================= *\
    Help: Precipitation command to view all commands or get information on a command
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

var command = {
    name: "help",
    desc: "Gets a list of commands, or shows information about a command.",
    args: {
        "command": {
            "desc": "The command to get help on",
            "required": false
        },
        "argument": {
            "desc": "The argument of the command to get help on",
            "required": false
        }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
            let cArgs = args.split(" ")
            let cmdHelp = cArgs[0].toLowerCase()
            let commandExists = false;
            let currentCmd;
            client.commands.each(cmd => {
                if (cmdHelp == cmd.name) {
                    commandExists = true;
                    currentCmd = cmd;
                }
            })
            if (commandExists) {
                let commandHelpEmbed = new MessageEmbed()
                .setTitle("Precipitation Index || " + host.prefix + currentCmd.name)
                .setColor(host.color)
                .setFooter({ text: 'Precipitation ' + host.version.external + " || bolded is a required argument, () is an argument, [] is an option", iconURL: client.user.displayAvatarURL() });
                let cmdArgs = "";
                if(cArgs[1]) {
                    if(currentCmd.args[cArgs[1].toLowerCase()]) {
                        for(arg in currentCmd.args) {
                            if(arg == cArgs[1].toLowerCase()) {
                                cmdArgs = cmdArgs + "__***(" + arg + ")***__ ";
                            } else {
                                cmdArgs = cmdArgs + "(" + arg + ") ";
                            }
                        }
                        commandHelpEmbed.addFields(
                            { name: "Selected Argument", value: host.prefix + cmdHelp + " " + cmdArgs + currentCmd.parameters },
                            { name: "Description", value: currentCmd.args[cArgs[1].toLowerCase()].desc }
                        )
                        return message.channel.send({embeds: [commandHelpEmbed]})
                    }
                    if(currentCmd.ver == "3.0.0") return message.channel.send("Argumentative help is a feature of Toyger, but unfortunately, this command hasn't been updated yet and is still designed for Shorthair.")
                    return message.channel.send("This argument doesn't exist - please execute `" + host.prefix + "help " + currentCmd.name + "` to view the arguments for this command.")
                }
                if(currentCmd.category == "Secrets") return message.channel.send("This is a secret...find out for yourself. :)")
                if(typeof currentCmd.args === 'object') {
                    for(arg in currentCmd.args) {
                        if(currentCmd.args[arg].required) { cmdArgs = cmdArgs + "**(" + arg + ")** "; continue; }
                        cmdArgs = cmdArgs + "(" + arg + ") ";
                    }
                } else {
                    cmdArgs = currentCmd.args;
                }
                commandHelpEmbed.addFields(
                    { name: "Description", value: currentCmd.desc},
                    { name: "Syntax", value: host.prefix + cmdHelp + " " + cmdArgs + currentCmd.parameters }
                )
                return message.channel.send({embeds: [commandHelpEmbed]})
            } else {
                let helpEmbed = new MessageEmbed()
                helpEmbed.setTitle("Precipitation Index")
                helpEmbed.setDescription('List of all commands -- use `' + host.prefix + '` before all commands!')
                let helpp = {};
                let cname;
                client.commands.each(cmd => {
                    if(message.guild) {
                        if(getTextInput(cmd.name, config.guilds[message.guild.id].disabled, 2)) return;
                    }
                    chelp = cmd.cat 
                    cname = cmd.name
                    if(!helpp[chelp]) {
                        helpp[chelp] = cname;
                    } else {
                        helpp[chelp] = helpp[chelp] + "\n" + cname
                    }
                })
                for(category in helpp) {
                    if(category != "Secrets") helpEmbed.addField(category, helpp[category], true)
                    if(category == "Secrets" && parameter == "easter-eggs") helpEmbed.addField(category, helpp[category], true) // only add Secrets if parameter is specified
                }
                helpEmbed.setColor(host.color)
                helpEmbed.setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                return message.channel.send({embeds: [helpEmbed]})
            }
        }
    },
    ver: "3.1.0",
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
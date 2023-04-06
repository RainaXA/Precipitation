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

const { MessageEmbed, MessageActionRow, MessageSelectMenu, Permissions } = require('discord.js')

let settingButton = {};
let currentMessage = {};

function interpretPermission(permission) {
    let permissions = Permissions.FLAGS;
    switch(permission) { // in order of the actual permissions in discord because it makes me happy
        case permissions.VIEW_CHANNEL:
            return "View Channel";
        case permissions.MANAGE_CHANNELS:
            return "Manage Channels";
        case permissions.MANAGE_ROLES:
            return "Manage Roles";
        case permissions.MANAGE_EMOJIS_AND_STICKERS:
            return "Manage Emojis and Stickers";
        case permissions.VIEW_AUDIT_LOG:
            return "View Audit Log";
        case permissions.MANAGE_WEBHOOKS:
            return "Manage Webhooks";
        case permissions.MANAGE_GUILD:
            return "Manage Server";
        case permissions.CREATE_INSTANT_INVITE:
            return "Create Invite";
        case permissions.CHANGE_NICKNAME:
            return "Change Nickname";
        case permissions.MANAGE_NICKNAMES:
            return "Manage Nicknames";
        case permissions.KICK_MEMBERS:
            return "Kick Members";
        case permissions.BAN_MEMBERS:
            return "Ban Members";
        case permissions.MODERATE_MEMBERS: 
            return "Timeout Members";
        case permissions.SEND_MESSAGES:
            return "Send Messages and Create Posts";
        case permissions.SEND_MESSAGES_IN_THREADS:
            return "Send Messages in Threads and Posts";
        case permissions.CREATE_PUBLIC_THREADS:
            return "Create Public Threads";
        case permissions.CREATE_PRIVATE_THREADS:
            return "Create Private Threads";
        case permissions.EMBED_LINKS:
            return "Embed Links";
        case permissions.ATTACH_FILES:
            return "Attach Files";
        case permissions.ADD_REACTIONS:
            return "Add Reactions";
        case permissions.USE_EXTERNAL_EMOJIS:
            return "Use External Emojis";
        case permissions.USE_EXTERNAL_STICKERS:
            return "Use External Stickers";
        case permissions.MENTION_EVERYONE:
            return "Mention @everyonе, @herе, and All Roles"; // yes those are cyrillic e's
        case permissions.MANAGE_MESSAGES:
            return "Manage Messages";
        case permissions.MANAGE_THREADS:
            return "Manage Threads and Posts";
        case permissions.READ_MESSAGE_HISTORY:
            return "Read Message History";
        case permissions.SEND_TTS_MESSAGES: 
            return "Send Text-to-Speech Messages";
        case permissions.USE_APPLICATION_COMMANDS:
            return "Use Application Commands";
        case permissions.CONNECT:
            return "Connect";
        case permissions.SPEAK:
            return "Speak";
        case permissions.STREAM:
            return "Video";
        case permissions.USE_EMBEDDED_ACTIVITIES:
            return "Use Activities";
        //case permissions.USE_SOUNDBOARD: // Use Soundboard
            //return "Manage Threads and Posts";
        case permissions.USE_VAD:
            return "Use Voice Activity";
        case permissions.PRIORITY_SPEAKER:
            return "Priority Speaker";
        case permissions.MUTE_MEMBERS: 
            return "Mute Members";
        case permissions.DEAFEN_MEMBERS:
            return "Deafen Members";
        case permissions.MOVE_MEMBERS:
            return "Move Members";
        case permissions.MANAGE_EVENTS:
            return "Manage Events";
        case permissions.ADMINISTRATOR:
            return "Administrator";
    }
    return permission; //if not found
}

var command = {
    name: "help",
    alias: [],
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
                let permList = "";
                for(permission of currentCmd.prereqs.user) {
                    permList = permList + interpretPermission(permission) + "\n"
                }
                if(permList === "") permList = "*None.*"
                let botList = "";
                for(permission of currentCmd.prereqs.bot) {
                    botList = botList + interpretPermission(permission) + "\n"
                }
                if(botList === "") botList = "*None.*"
                commandHelpEmbed.addFields(
                    { name: "Description", value: currentCmd.desc, inline: true },
                    { name: "Command Version", value: currentCmd.ver, inline: false },
                    { name: "User Permissions", value: permList, inline: true },
                    { name: "Bot Permissions", value: botList, inline: true },
                    { name: "Syntax", value: host.prefix + cmdHelp + " " + cmdArgs + currentCmd.parameters }
                )
                let cmds = []; // cannot be over 25 commands - KEEP IN MIND
                client.commands.each(cmd => {
                    if(cmd.execute.discord && !cmd.prereqs.owner) cmds.push({
                        label: cmd.name,
                        description: cmd.desc,
                        value: cmd.name,
                    });
                })
                let row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu() 
                        .setCustomId('select')
                        .setPlaceholder('Select a command to view help on...')
                        .addOptions(cmds)
                );
                return message.channel.send({embeds: [commandHelpEmbed], components: [row]}).then(m => {
                    settingButton[m.id] = message.author.id;
                    currentMessage[message.author.id] = m;
                })
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
                helpEmbed.setFooter({ text: "Precipitation " + host.version.external + " " + host.version.name, iconURL: client.user.displayAvatarURL() })
                let cmds = []; // cannot be over 25 commands - KEEP IN MIND
                client.commands.each(cmd => {
                    if(cmd.execute.discord && !cmd.prereqs.owner) cmds.push({
                        label: cmd.name,
                        description: cmd.desc,
                        value: cmd.name,
                    });
                })
                let row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu() 
                        .setCustomId('select')
                        .setPlaceholder('Select a command to view help on...')
                        .addOptions(cmds)
                );
                return message.channel.send({embeds: [helpEmbed], components: [row]}).then(m => {
                    settingButton[m.id] = message.author.id;
                    currentMessage[message.author.id] = m;
                })
            }
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

client.on('interactionCreate', interaction => { // receive button input from line 78
    if (!interaction.isSelectMenu()) return;
    if (settingButton[interaction.message.id] != interaction.user.id) return;
    interaction.update({
        components: interaction.components
    }).then(m => {
        let currentCmd = client.commands.get(interaction.values[0]);
        let commandHelpEmbed = new MessageEmbed()
                .setTitle("Precipitation Index || " + host.prefix + currentCmd.name)
                .setColor(host.color)
                .setFooter({ text: 'Precipitation ' + host.version.external + " || bolded is a required argument, () is an argument, [] is an option", iconURL: client.user.displayAvatarURL() });
                let cmdArgs = "";
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
                    { name: "Syntax", value: host.prefix + currentCmd.name + " " + cmdArgs + currentCmd.parameters }
                )
        return currentMessage[interaction.user.id].edit({embeds: [commandHelpEmbed]})
    });
});

module.exports = command;
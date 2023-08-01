/* ========================================================================= *\
    Config: Precipitation command to change server configurations
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

const { Permissions, MessageEmbed, MessageActionRow, MessageSelectMenu, TextInputComponent } = require('discord.js')
//const { SlashCommandBuilder } = require('@discordjs/builders');

let settingButton = {};
let currentMessage = {};

client.on('ready', async() => { // init guilds on start
    client.guilds.cache.each(guild => {
      if(!config.guilds[guild.id].settings) { // allow for general settings
        config.guilds[guild.id].settings = {};
        log("Initialized " + guild.name + " as guild. (config.guilds[guild.id].settings)", logging.info, "config")
      }
      if(!config.guilds[guild.id].settings.logging) { // logging category
        config.guilds[guild.id].settings.logging = {};
        log("Initialized " + guild.name + " as guild. (config.guilds[guild.id].settings.logging)", logging.debug, "config")
      }
    });
  })

try {
  var name = require('./name.js').exports.name;
} catch(err) {
  log("name function not found - using discord username.", logging.warn, "config")
  function name(user) {
    return user.username;
  }
}

var command = {
    name: "config",
    alias: [],
    desc: "Changes server-specific properties.",
    args: {
      "setting": {
        "desc": "Which setting to change",
        "required": true
      },
      "option": {
        "desc": "What to change the setting to",
        "required": true
      }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
          if(!config.guilds[message.guild.id].settings) config.guilds[message.guild.id].settings = {};
          if(!config.guilds[message.guild.id].settings.logging) config.guilds[message.guild.id].settings.logging = {};
            let cArg = args.split(" ")
            if(!cArg[1] && cArg[0]) return message.channel.send("Please add another argument.")
            switch(cArg[0].toLowerCase()) {
                case "prefix":
                  if(getTextInput(cArg[1], host.slurs)) return message.channel.send("Sorry, but the chosen prefix contains offensive language and will not be used by Precipitation.")
                  config.guilds[message.guild.id].prefix = cArg[1].toLowerCase()
                  return message.channel.send("Okay, I've set your server prefix to `" + cArg[1].toLowerCase() + "`.");
                case "filter":
                  if(cArg[1].toLowerCase() == "true") {
                      config.guilds[message.guild.id].settings.filter = true;
                      return message.channel.send("Okay, I'm setting your filter to `true`.");
                  } else {
                      config.guilds[message.guild.id].settings.filter = false;
                      return message.channel.send("Okay, I'm setting your filter to `false`.");
                  }
                case "mlog":
                  if(cArg[1].toLowerCase() == "none") {
                      config.guilds[message.guild.id].settings.logging.messages = null
                      return message.channel.send("Okay, you will no longer have messages logged.")
                  } else {
                      if(message.guild.channels.cache.get(cArg[1]) === undefined) return message.channel.send("This channel does not exist. Please use `none` to disable the feature.")
                      config.guilds[message.guild.id].settings.logging.messages = cArg[1]
                      return message.channel.send("Okay, I will log messages in " + message.guild.channels.cache.get(cArg[1]).name + ".")
                  }
                case "mblog":
                  if(cArg[1].toLowerCase() == "none") {
                      config.guilds[message.guild.id].settings.logging.members = null
                      return message.channel.send("Okay, you will no longer have members logged.")
                  } else {
                      if(message.guild.channels.cache.get(cArg[1]) === undefined) return message.channel.send("This channel does not exist. Please use `none` to disable the feature.")
                      config.guilds[message.guild.id].settings.logging.members = cArg[1]
                      return message.channel.send("Okay, I will log members in " + message.guild.channels.cache.get(cArg[1]).name + ".")
                  }
                case "updog":
                  if(cArg[1].toLowerCase() == "true") {
                      return message.channel.send("This feature is fairly offensive, as it was designed for a friend. It is not advised to use this feature unless you AND your server members are absolutely okay with ironic suicidal remarks.\n\nTo mitigate this warning, please re-execute the command using `YES` instead of `true`.")
                  } else if(cArg[1] == "YES") {
                    config.guilds[message.guild.id].settings.updog = true;
                    return message.channel.send("Okay, I'm setting the updog anger to `true`.");
                  } else {
                      config.guilds[message.guild.id].settings.updog = false;
                      return message.channel.send("Okay, I'm setting the updog anger to `false`.");
                  }
                default:
                  let configuration = new MessageEmbed()
                  .setTitle("Server Configuration || " + message.guild.name)
                  .addFields(
                    { name: "Prefix (prefix)", value: config.guilds[message.guild.id].prefix },
                    { name: "Slur Filter (filter)", value: String(config.guilds[message.guild.id].settings.filter).replace("false", "Disabled").replace("true", "Enabled").replace("undefined", "Disabled") },
                    { name: "Message Logging (mlog)", value: String(config.guilds[message.guild.id].settings.logging.messages).replace("null", "Disabled").replace("undefined", "Disabled") },
                    { name: "Member Logging (mblog)", value: String(config.guilds[message.guild.id].settings.logging.members).replace("null", "Disabled").replace("undefined", "Disabled") },
                    { name: "I HATE UPDOG (updog)", value: String(config.guilds[message.guild.id].settings.updog).replace("false", "Disabled").replace("undefined", "Disabled").replace("true", "Enabled") }
                  )
                  .setColor(host.color)
                  .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                  let row = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu() 
                          .setCustomId('select')
                          .setPlaceholder('Select a server option to change...')
                          .addOptions([
                            { label: "Prefix", description: "Changes the prefix that Precipitation listens for in this server.", value: "Prefix" },
                            { label: "Slur Filter", description: "Changes whether or not Precipitation will delete messages containing slurs.", value: "Slur Filter" },
                            { label: "Message Logging", description: "Changes where Precipitation logs edited and deleted messages.", value: "Message Logging" },
                            { label: "Member Logging", description: "Changes where Precipitation logs arriving and departing members.", value: "Member Logging" },
                            { label: "I HATE UPDOG", description: "Changes whether or not Precipitation gets upset when anyone says updog.", value: "I HATE UPDOG" }
                          ])
                  );
                  return message.channel.send({embeds: [configuration], components: [row]}).then(m => {
                    settingButton[m.id] = message.author.id;
                    currentMessage[message.author.id] = m;
                })
            }
        }
    },
    ver: "3.2.0",
    cat: "General",
    prereqs: {
        dm: false,
        owner: false,
        user: [Permissions.FLAGS.MANAGE_GUILD],
        bot: [Permissions.FLAGS.MANAGE_MESSAGES]
    },
    unloadable: true
}

module.exports = command;

// filter module
client.on('messageCreate', message => {
    if(!message.guild) return; // do not do anything if it's a dm
    if(!config.guilds[message.guild.id].settings) config.guilds[message.guild.id].settings = {};
    if (config.guilds[message.guild.id].settings.filter && getTextInput(message.content, host.slurs, 3)) {
      message.channel.messages.fetch(message.id).then(message => message.delete())
      if(message.author.id != client.user.id) message.author.send("Hey, " + name(message.author) + "!\n\nThis server has banned very offensive words. Please refrain from using these words.")
    }
  })


// I HATE UPDOG MODULE
// designed for a friend
client.on('messageCreate', message => {
  if(!message.guild) return; // do not do anything if it's a dm
  if(!config.guilds[message.guild.id].settings) config.guilds[message.guild.id].settings = {};
  if (config.guilds[message.guild.id].settings.updog && message.content.toLowerCase().includes("updog") && !message.content.toLowerCase().includes("config updog")) {
    if(message.author.id != client.user.id) message.channel.send("<@" + message.author.id + ">, https://cdn.discordapp.com/attachments/626264483513499649/1084593676317106247/IMG_4632.jpg")
  }
})

client.on('interactionCreate', interaction => { 
  if (!interaction.isSelectMenu()) return;
  if (settingButton[interaction.message.id] != interaction.user.id) return;
  interaction.update({
      components: interaction.components
  }).then(m => {
      let option = interaction.values[0];
      let value = "Undefined Value";
      switch(option) {
        case "Prefix":
          value = config.guilds[interaction.guild.id].prefix;
          break;
        case "Slur Filter":
          value = String(config.guilds[interaction.guild.id].settings.filter).replace("false", "Disabled").replace("true", "Enabled").replace("undefined", "Disabled");
          break;
        case "Message Logging":
          value = String(config.guilds[interaction.guild.id].settings.logging.messages).replace("null", "Disabled").replace("undefined", "Disabled");
          break;
        case "Member Logging":
          value = String(config.guilds[interaction.guild.id].settings.logging.members).replace("null", "Disabled").replace("undefined", "Disabled");
          break;
        case "I HATE UPDOG":
          value = String(config.guilds[interaction.guild.id].settings.updog).replace("false", "Disabled").replace("undefined", "Disabled").replace("true", "Enabled");
          break;
      }
      let configuration = new MessageEmbed()
      .setTitle("Server Configuration || " + interaction.guild.name + " >> " + option)
      .addFields({ name: "Current Value", value: value })
      .setColor(host.color)
      .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
      /*let rowa = new MessageActionRow() produces fucking stupid error
        .addComponents(
          new TextInputComponent() 
            .setCustomId('newOption')
            .setPlaceholder('Hmm')
            .setLabel("How's it looking?")
            .setStyle("SHORT")
        )*/
        return currentMessage[interaction.user.id].edit({embeds: [configuration], /*components: [rowa]*/})
  });
});
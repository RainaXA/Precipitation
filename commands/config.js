const { Permissions, MessageEmbed } = require('discord.js')
//const { SlashCommandBuilder } = require('@discordjs/builders');

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
  var name = require('./name.js').name;
} catch(err) {
  log("name function not found - using discord username.", logging.warn, "config")
  function name(user) {
    return user.username;
  }
}

var command = {
    name: "config",
    desc: "Changes server-specific properties.",
    args: "",
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
                default:
                let configuration = new MessageEmbed()
                .setTitle("Server Configuration || " + message.guild.name)
                .addField("Prefix (prefix)", config.guilds[message.guild.id].prefix)
                .addField("Slur Filter (filter)", String(config.guilds[message.guild.id].settings.filter).replace("false", "Disabled").replace("true", "Enabled").replace("undefined", "Disabled"))
                .addField("Message Logging (mlog)", String(config.guilds[message.guild.id].settings.logging.messages).replace("null", "Disabled").replace("undefined", "Disabled")) // set to string, if null or undefined, replace with Disabled. damn i feel cool!
                .addField("Member Logging (mblog)", String(config.guilds[message.guild.id].settings.logging.members).replace("null", "Disabled").replace("undefined", "Disabled"))
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
                return message.channel.send({embeds: [configuration]})
            }
        }
    },
    ver: "3.0.0",
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

client.on('messageCreate', message => {
    if(!message.guild) return; // do not do anything if it's a dm
    if(!config.guilds[message.guild.id].settings) config.guilds[message.guild.id].settings = {};
    if (config.guilds[message.guild.id].settings.filter && getTextInput(message.content, host.slurs)) {
      message.channel.messages.fetch(message.id).then(message => message.delete())
      if(message.author.id != client.user.id) message.author.send("Hey, " + name(message.author) + "!\n\nThis server has banned very offensive words. Please refrain from using these words.")
    }
  })
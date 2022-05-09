module.exports.run = async (client, message, args, parameter) => {
  const help = require("../help.json")
  const { MessageEmbed } = require('discord.js')
  let cmdHelp = args.toLowerCase()
  let test = false;
  if(help.commandHelp[cmdHelp]) test = true;
  if (test == true) {
    let commandHelpEmbed = new MessageEmbed()
    .setTitle("Precipitation Index || " + config.guilds[message.guild.id].prefix + cmdHelp)
    .addFields(
      { name: "Description", value: help.commandHelp[cmdHelp].description},
      { name: "Syntax", value: config.guilds[message.guild.id].prefix + cmdHelp + " " + help.commandHelp[cmdHelp].syntax}
    )
    .setColor("BLUE")
    .setFooter({ text: 'Precipitation ' + version + " || [] denotes a parameter, () denotes an argument, bolded is REQUIRED."});
    return message.channel.send({embeds: [commandHelpEmbed]})
  }
    let helpEmbed = new MessageEmbed()
    helpEmbed.setTitle("Precipitation Index")
    helpEmbed.setDescription('List of all commands -- use `' + config.guilds[message.guild.id].prefix + '` before all commands!')
    /*for(section in help.commandList) {
      console.log(section)
      helpEmbed.addField(section, section.commands, true)
    }*/
    // if anyone can figure this out, please make a pr :D
    .addFields(
      { name: "General", value: "ping\nhelp\nversion\nabout\nuptime", inline: true },
      { name: "Personalization", value: "name\ngender\nbirthday\nlocation", inline: true },
      { name: "Alpha", value: "placevalue", inline: true },
      { name: "Moderation", "value": "find\nuinfo\nrm\nconfig\nwarn\nlswarn\nrmwarn", inline: true }
    )
    if(parameter == "easter-eggs") helpEmbed.addField("Secrets", "bitches", true)
    helpEmbed.setColor("BLUE")
    helpEmbed.setFooter({ text: 'Precipitation ' + version });
    return message.channel.send({embeds: [helpEmbed]})
}

module.exports.help = {
    name: "help",
    desc: "Gets a list of commands, or shows information about a command.",
    args: "(command)",
    parameters: "",
    category: "General"
}

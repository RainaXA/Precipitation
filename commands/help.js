module.exports.run = async (message, args, parameter) => {
  const { MessageEmbed } = require('discord.js')
  let cmdHelp = args.toLowerCase()
  let commandExists = false;
  let currentCmd;
  client.commands.each(cmd => {
    if (cmdHelp == cmd.help.name) {
      commandExists = true;
      currentCmd = cmd.help;
    }
  })
  if (commandExists) {
    if(currentCmd.category == "Secrets") return message.channel.send("This is a secret...find out for yourself. :)")
    let commandHelpEmbed = new MessageEmbed()
    .setTitle("Precipitation Index || " + config.guilds[message.guild.id].prefix + cmdHelp)
    .addFields(
      { name: "Description", value: currentCmd.desc},
      { name: "Syntax", value: config.guilds[message.guild.id].prefix + cmdHelp + " " + currentCmd.args + " " + currentCmd.parameters }
    )
    .setColor("BLUE")
    .setFooter({ text: 'Precipitation ' + version.external + " || bolded is a required argument, () is an argument, [] is an option"});
    return message.channel.send({embeds: [commandHelpEmbed]})
  } else {
    let helpEmbed = new MessageEmbed()
    helpEmbed.setTitle("Precipitation Index")
    helpEmbed.setDescription('List of all commands -- use `' + config.guilds[message.guild.id].prefix + '` before all commands!')
    let helpp = {};
    client.commands.each(cmd => {
      if(!helpp[cmd.help.category]) {
        helpp[cmd.help.category] = cmd.help.name;
      } else {
        helpp[cmd.help.category] = helpp[cmd.help.category] + "\n" + cmd.help.name
      }
    })
    for(category in helpp) {
      if(category != "Secrets") helpEmbed.addField(category, helpp[category], true)
      if(category == "Secrets" && parameter == "easter-eggs") helpEmbed.addField(category, helpp[category], true) // only add Secrets if parameter is specified
    }
    helpEmbed.setColor("BLUE")
    helpEmbed.setFooter({ text: 'Precipitation ' + version.external });
    return message.channel.send({embeds: [helpEmbed]})
  }
}

module.exports.help = {
    name: "help",
    desc: "Gets a list of commands, or shows information about a command.",
    args: "(command)",
    parameters: "[--easter-eggs]",
    category: "General",
    version: "1.0.0"
}

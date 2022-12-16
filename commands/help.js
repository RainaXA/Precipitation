const { MessageEmbed } = require('discord.js')

module.exports.default = async (message, args, parameter) => {
  let cmdHelp = args.toLowerCase()
  let commandExists = false;
  let currentCmd;
  let chelp;
  client.commands.each(cmd => {
    if (!cmd.help) {
      chelp = cmd 
    } else { 
      chelp = cmd.help 
    }
    if (cmdHelp == chelp.name) {
      commandExists = true;
      currentCmd = cmd.help;
    }
  })
  if (commandExists) {
    if(currentCmd.category == "Secrets") return message.channel.send("This is a secret...find out for yourself. :)")
    let commandHelpEmbed = new MessageEmbed()
    .setTitle("Precipitation Index || " + host.prefix[branch] + cmdHelp)
    .addFields(
      { name: "Description", value: currentCmd.desc},
      { name: "Syntax", value: host.prefix[branch] + cmdHelp + " " + currentCmd.args + " " + currentCmd.parameters }
    )
    .setColor(host.embedColor)
    .setFooter({ text: 'Precipitation ' + host.version.external + " || bolded is a required argument, () is an argument, [] is an option", iconURL: client.user.displayAvatarURL() });
    return message.channel.send({embeds: [commandHelpEmbed]})
  } else {
    let helpEmbed = new MessageEmbed()
    helpEmbed.setTitle("Precipitation Index")
    helpEmbed.setDescription('List of all commands -- use `' + host.prefix + '` before all commands!')
    let helpp = {};
    let cname;
    client.commands.each(cmd => {
      if (!cmd.help) {
        chelp = cmd.cat 
        cname = cmd.name
      } else { 
        chelp = cmd.help.category
        cname = cmd.help.name 
      }
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
    helpEmbed.setColor(host.embedColor)
    helpEmbed.setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
    return message.channel.send({embeds: [helpEmbed]})
  }
}

module.exports.help = {
    name: "help",
    desc: "Gets a list of commands, or shows information about a command.",
    args: "(command)",
    parameters: "[--easter-eggs]",
    category: "General",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true
}

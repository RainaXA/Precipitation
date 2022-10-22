const { MessageEmbed } = require('discord.js')

module.exports.default = async (message, args, parameter) => {
  let cmdHelp = args.toLowerCase()
  let commandExists = false;
  let currentCmd;
  client.commands.each(cmd => {
    if (cmdHelp == cmd.help.name) {
      commandExists = true;
      currentCmd = cmd.help;
    }
  })
  if(message.guild) {
    switch(config.guilds[message.guild.id].branch) {
      case "roll":
        client.commands.roll.each(cmd => {
          if (cmdHelp == cmd.help.name) {
            commandExists = true;
            currentCmd = cmd.help;
          }
        })
        break;
      case "bleed":
        client.commands.bleed.each(cmd => {
          if (cmdHelp == cmd.help.name) {
            commandExists = true;
            currentCmd = cmd.help;
          }
        })
        break;
    }
  }
  if (commandExists) {
    if(currentCmd.category == "Secrets") return message.channel.send("This is a secret...find out for yourself. :)")
    let commandHelpEmbed = new MessageEmbed()
    .setTitle("Precipitation Index || " + host.prefix[branch] + cmdHelp)
    .addFields(
      { name: "Description", value: currentCmd.desc},
      { name: "Syntax", value: host.prefix[branch] + cmdHelp + " " + currentCmd.args + " " + currentCmd.parameters }
    )
    .setColor(host.colors[branch])
    .setFooter({ text: 'Precipitation ' + host.version.external + " || bolded is a required argument, () is an argument, [] is an option", iconURL: client.user.displayAvatarURL() });
    return message.channel.send({embeds: [commandHelpEmbed]})
  } else {
    let helpEmbed = new MessageEmbed()
    helpEmbed.setTitle("Precipitation Index")
    helpEmbed.setDescription('List of all commands -- use `' + host.prefix[branch] + '` before all commands!')
    let helpp = {};
    let listed = [];
    client.commands.each(cmd => {
      if(!helpp[cmd.help.category]) {
        helpp[cmd.help.category] = cmd.help.name;
        listed.push(cmd.help.name)
      } else {
        helpp[cmd.help.category] = helpp[cmd.help.category] + "\n" + cmd.help.name
        listed.push(cmd.help.name)
      }
    })
    if(message.guild) {
      switch(config.guilds[message.guild.id].branch) {
        case "roll":
          client.commands.roll.each(cmd => {
            if(!getTextInput(cmd.help.name, listed)) {
              if(!helpp[cmd.help.category]) {
                helpp[cmd.help.category] = cmd.help.name + " [roll]";
                listed.push(cmd.help.name)
              } else {
                helpp[cmd.help.category] = helpp[cmd.help.category] + "\n" + cmd.help.name + " [roll]";
                listed.push(cmd.help.name)
              }
            }
          })
          break;
        case "bleed":
          client.commands.bleed.each(cmd => {
            if(!getTextInput(cmd.help.name, listed)) {
              if(!helpp[cmd.help.category]) {
                helpp[cmd.help.category] = cmd.help.name + " [bleed]";
                listed.push(cmd.help.name)
              } else {
                helpp[cmd.help.category] = helpp[cmd.help.category] + "\n" + cmd.help.name + " [bleed]";
                listed.push(cmd.help.name)
              }
            }
          })
          break;
      }
    }
    for(category in helpp) {
      if(category != "Secrets") helpEmbed.addField(category, helpp[category], true)
      if(category == "Secrets" && parameter == "easter-eggs") helpEmbed.addField(category, helpp[category], true) // only add Secrets if parameter is specified
    }
    helpEmbed.setColor(host.colors[branch])
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

module.exports.run = async (message, args, parameter) => {
    const { Permissions, MessageEmbed } = require('discord.js')
    if(!args) {
          let warnings = config.guilds[message.guild.id].warnings[message.author.id];
          if(warnings == undefined || warnings.length == 0) return message.channel.send("You have no warnings.")
          let warningEmbed = new MessageEmbed()
          .setTitle("Warnings List for " + message.author.tag)
          .setColor("BLUE")
          .setFooter({ text: 'Precipitation ' + version })
          for(let i = 0; i < warnings.length; i++) {
            warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
          }
          return message.channel.send({embeds: [warningEmbed]})
        } else {
          if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return message.channel.send("You don't have the required permissions to perform this action.")
          let listUser = find(args.toLowerCase(), "first", null, "list")
          let warnings = config.guilds[message.guild.id].warnings[listUser.id];
          if(warnings == undefined || warnings.length == 0) return message.channel.send("User does not exist, or they have no warnings.")
          let getWarnings;
          if(listUser) {
            message.guild.members.cache.each(member => {
              if(listUser.id == member.id) {
                return getWarnings = member;
              }
            })
            initUser(listUser)
          }
          if(!getWarnings) return message.channel.send("Please ensure the user is in the server.")
          let warningEmbed = new MessageEmbed()
          .setTitle("Warnings List for " + listUser.tag)
          .setColor("BLUE")
          .setFooter({ text: 'Precipitation ' + version.external })
          for(let i = 0; i < warnings.length; i++) {
            warningEmbed.addField("Warning #" + (i + 1), "*" + warnings[i] + "*")
          }
          return message.channel.send({embeds: [warningEmbed]})
        }
}

module.exports.help = {
    name: "lswarn",
    desc: "See your current warnings, or see someone else's.",
    args: "(user)",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

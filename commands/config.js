module.exports.run = async (message, args, parameter) => {
  const { Permissions, MessageEmbed } = require('discord.js')
  if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.channel.send("You don't have the proper permissions to perform this action.")
  let cArg = args.split(" ")
  switch(cArg[0].toLowerCase()) {
    case "prefix":
      if(getTextInput(cArg[1])) return message.channel.send("Maybe set a prefix that's a little less offensive?")
      config.guilds[message.guild.id].prefix = cArg[1].toLowerCase()
      return message.channel.send("Okay, I've set your server prefix to `" + cArg[1].toLowerCase() + "`.");

    case "filter":
      if(cArg[1].toLowerCase() == "true") {
        if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send("I don't have the permissions to delete messages, so I won't turn on the filter.")
        config.guilds[message.guild.id].filter = true;
        return message.channel.send("Okay, I'm setting your filter to `true`.");
      } else {
        config.guilds[message.guild.id].filter = false;
        return message.channel.send("Okay, I'm setting your filter to `false`.");
      }

    default:
      let configuration = new MessageEmbed()
      .setTitle("Server Configuration || " + message.guild.name)
      .addFields(
        { name: "Prefix (prefix)", value: config.guilds[message.guild.id].prefix },
        { name: "Slur Filter (filter)", value: (config.guilds[message.guild.id].filter).toString() }
      )
      .setColor("BLUE")
      .setFooter({ text: 'Precipitation ' + version });
      return message.channel.send({embeds: [configuration]})
  }
}

module.exports.help = {
    name: "config",
    desc: "Changes server-specific properties.",
    args: "**(setting) (value)**",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

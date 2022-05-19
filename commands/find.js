module.exports.run = async (message, args, parameter) => {
  const { MessageEmbed } = require('discord.js')
  if(!args) return message.channel.send("Please input a parameter.")
  let findList = new MessageEmbed()
  .setTitle("Precipitation Query")
  .addFields(
    { name: "Results", value: find(args.toLowerCase(), "list", 10, "list")}
  )
  .setColor("BLUE")
  .setFooter({ text: 'Precipitation ' + version.external  + find(args.toLowerCase(), "list", 10, "amount")});
  return message.channel.send({embeds: [findList]})
}

module.exports.help = {
    name: "find",
    desc: "Finds a user",
    args: "**(user)**",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

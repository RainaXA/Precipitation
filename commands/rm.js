module.exports.run = async (message, args, parameter) => {
  const { Permissions } = require('discord.js')
  if(parseInt(args) == 0) return message.channel.send("Okay, I didn't delete any messages.")
  let purgeList = "Please:\n";
  if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) purgeList = purgeList + "- ensure you have permissions\n"
  if(!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) purgeList = purgeList + "- ensure I have permissions\n"
  if(isNaN(parseInt(args))) purgeList = purgeList + "- insert a number\n"
  if(parseInt(args) > 99) purgeList = purgeList + "- ensure the number you've inputted is between 1-99."
  if(purgeList == "Please:\n") {
    try {
      if(parseInt(args) == 1) {
        return message.channel.bulkDelete(2, { filterOld: true }).then(messages => {
          if(parseInt(args) + 1 == messages.size) {
            message.channel.send("Okay, I've deleted the above message. (really?)")
          } else {
            message.channel.send("Unfortunately, due to Discord limitations, I could not delete the above message.")
          }
        })
      }
      return message.channel.bulkDelete(parseInt(args) + 1, { filterOld: true }).then(messages => {
        if(parseInt(args) + 1 == messages.size) {
          message.channel.send("Okay, I've deleted " + args + " messages.")
        } else {
          message.channel.send("Unfortunately, due to Discord limitations, I could only delete " + messages.size + " messages.")
        }
      })
    } catch (err) {
      message.channel.send("Due to a fatal error, the messages could not be deleted.")
    }
  }
  return message.channel.send(purgeList)
}

module.exports.help = {
    name: "rm",
    alias: "purge",
    desc: "Bulk delete messages.",
    args: "*(number, 1-99)**",
    parameters: "",
    category: "Moderation",
    version: "1.0.1"
}

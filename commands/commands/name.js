global.name = function (user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
}

module.exports.run = async (message, args, parameter) => {
  if(args.length >= 75) return message.channel.send("That's too long of a name.")
  if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("I won't ping anyone.")
  if(getTextInput(args) == true) return message.channel.send("Hey, I'm not going to yell out offensive words.")
  if(args == "") {
    config.users[message.author.id].name = null;
    return message.channel.send("Sure, I'll refer to you by your username.")
  }
  config.users[message.author.id].name = args;
  return message.channel.send("Sure, I'll refer to you by \"" + name(message.author) + "\".")
}

module.exports.help = {
    name: "name",
    desc: "Sets the name for the bot to refer to you as.",
    args: "(name)",
    parameters: "",
    category: "Personalization",
    version: "1.0.0"
}

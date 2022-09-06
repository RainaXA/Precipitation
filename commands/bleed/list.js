const { MessageEmbed } = require('discord.js')

module.exports.default = async (message, args, parameter) => {
  let cArg = args.split(" ")
  if(!config.users[message.author.id]) config.users[message.author.id] = {};
  switch(cArg[0]) {
    case "save":
      if(!cArg[1]) return message.channel.send("You must input a list, separated by commas.")
      let list = args.slice(5).split(",");
      if(!list[1]) return message.channel.send("You must have at least 2 arguments for the list.")
      config.users[message.author.id].list = args.slice(5)
      return message.channel.send("Your list has been saved.")
    case "pick":
      if(!config.users[message.author.id].list) return message.channel.send("You must first save a list.")
      if(args.toLowerCase() == "pick") {
        let listt = config.users[message.author.id].list.split(",");
        let rng = Math.floor(Math.random() * listt.length)
        let item = listt[rng]
        message.channel.send(item)
      } else {
        let listt = args.slice(5).split(",");
        let rng = Math.floor(Math.random() * listt.length)
        let item = listt[rng]
        message.channel.send(item)
      }
  }
}

module.exports.help = {
    name: "list",
    desc: "Pick from a list of items.",
    args: "**(save | pick)** (**what to save** | custom unsaved list)",
    parameters: "",
    category: "Misc.",
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
    unloadable: true,
    requireOwner: false
}

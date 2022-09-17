module.exports.default = async (message, args, parameter) => {
  let cArg = args.toLowerCase().split(" ")
  let props;
  let cmdExist = false;
  let newArgs = args.toLowerCase().slice(cArg[0].length + 1)
  switch(cArg[0]) { // now to get branch
    case "stable":
      client.commands.each(cmd => {
        if(newArgs == cmd.help.name) {
          cmdExist = true;
          if(!cmd.metadata.unloadable) return message.channel.send("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.")
          let ul = require.resolve('./' + cmd.help.name + '.js')
          delete require.cache[ul]
          client.commands.delete(newArgs)
          message.channel.send("Command \"" + newArgs + "\" has been unloaded from `stable`.")
          return log("Command \"" + cmd.help.name + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.info, "UNLOAD")
        }
      })
      if(!cmdExist) {
        return message.channel.send("Command \"" + newArgs + "\" couldn't be found.")
      }
    case "roll":
      client.commands.roll.each(cmd => {
        if(newArgs == cmd.help.name) {
          cmdExist = true;
          if(!cmd.metadata.unloadable) return message.channel.send("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.")
          let ul = require.resolve('./roll/' + cmd.help.name + '.js')
          delete require.cache[ul]
          client.commands.roll.delete(newArgs)
          message.channel.send("Command \"" + newArgs + "\" has been unloaded from `roll`.")
          return log("Command \"" + cmd.help.name + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.info, "UNLOAD")
        }
      })
      if(!cmdExist) {
        return message.channel.send("Command \"" + newArgs + "\" couldn't be found.")
      }
    case "bleed":
      client.commands.bleed.each(cmd => {
        if(newArgs == cmd.help.name) {
          cmdExist = true;
          if(!cmd.metadata.unloadable) return message.channel.send("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.")
          let ul = require.resolve('./bleed/' + cmd.help.name + '.js')
          delete require.cache[ul]
          client.commands.bleed.delete(newArgs)
          message.channel.send("Command \"" + newArgs + "\" has been unloaded from `bleed`.")
          return log("Command \"" + cmd.help.name + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.info, "UNLOAD")
        }
      })
      if(!cmdExist) {
        return message.channel.send("Command \"" + newArgs + "\" couldn't be found.")
      }
      case "cat":
      case "cat-mode":
        client.commands.cat.each(cmd => {
          if(newArgs == cmd.help.name) {
            cmdExist = true;
            if(!cmd.metadata.unloadable) return message.channel.send("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.")
            let ul = require.resolve('./cat/' + cmd.help.name + '.js')
            delete require.cache[ul]
            client.commands.cat.delete(newArgs)
            message.channel.send("Command \"" + newArgs + "\" has been unloaded from `cat`.")
            return log("Command \"" + cmd.help.name + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.info, "UNLOAD")
          }
        })
        if(!cmdExist) {
          return message.channel.send("Command \"" + newArgs + "\" couldn't be found.")
        }
      default:
        return message.channel.send("Branch does not exist.")
  }
}

module.exports.console = async (args) => {
  let cmdExist = false;
  client.commands.each(cmd => {
    if(args == cmd.help.name) {
      cmdExist = true;
      if(!cmd.metadata.unloadable) return log("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.", logging.info, "UNLOAD")
      let ul = require.resolve('./' + cmd.help.name + '.js')
      delete require.cache[ul]
      client.commands.delete(args)
      log("Command \"" + cmd.help.name + "\" has been unloaded.", logging.success, "UNLOAD")
    }
  })
  if(!cmdExist) {
    log("Command \"" + args + "\" couldn't be found.", logging.warn, "UNLOAD")
  }
}

module.exports.help = {
    name: "unload",
    desc: "Unload a module from the bot.",
    args: "**(command | module)** (command branch if applicable) **(to unload)**",
    parameters: "",
    category: "Owner",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": true
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: false,
    requireOwner: true
}

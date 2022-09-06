module.exports.default = async (message, args, parameter) => {
  let cmdExist = false;
  client.commands.each(cmd => {
    if(args == cmd.help.name) {
      cmdExist = true;
      if(!cmd.metadata.unloadable) return message.channel.send("This command is a core component of Precipitation modularity and unloading this command could cause issues with modularity.")
      let ul = require.resolve('./' + cmd.help.name + '.js')
      delete require.cache[ul]
      client.commands.delete(args)
      message.channel.send("Command \"" + cmd.help.name + "\" has been unloaded.")
      log("Command \"" + cmd.help.name + "\" has been unloaded through message.\nIf the bot has malfunctioned for any reason and you did not perform this action, please shut down the bot immediately.", logging.info, "UNLOAD")
    }
  })
  if(!cmdExist) {
    message.channel.send("Command \"" + args + "\" couldn't be found.")
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
    desc: "Unload a command module from the bot.",
    args: "**(command)**",
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

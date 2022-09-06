module.exports.default = async (message, args, parameter) => {
  try {
    let props = require(`./${args}` + ".js");
    client.commands.set(props.help.name, props);
    message.channel.send("Command \"" + props.help.name + "\" has been loaded.")
  } catch (err) {
    log(err.stack, logging.error, "LOAD")
  }
}

module.exports.console = async (args) => {
  try {
    let props = require(`./${args}` + ".js");
    client.commands.set(props.help.name, props);
    log("Command \"" + props.help.name + "\" has been loaded.", logging.success, "LOAD")
  } catch (err) {
    log(err.stack, logging.error, "LOAD")
  }
}

module.exports.help = {
    name: "load",
    desc: "Load a command module into the bot.",
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

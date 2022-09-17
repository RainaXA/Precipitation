module.exports.default = async (message, args, parameter) => {
  try {
    let cArg = args.toLowerCase().split(" ")
    let props;
    switch(cArg[0]) {
      case "command":
        let newArgs = args.slice(cArg[0].length + cArg[1].length + 2)
        switch(cArg[1]) { // now to get branch
          case "stable":
            props = require(`./${newArgs}` + ".js");
            client.commands.set(props.help.name, props);
            return message.channel.send("Command \"" + props.help.name + "\" has been loaded into `stable`.")
          case "roll":
            props = require(`./roll/${newArgs}` + ".js");
            client.commands.roll.set(props.help.name, props);
            return message.channel.send("Command \"" + props.help.name + "\" has been loaded into `roll`.")
          case "bleed":
            props = require(`./bleed/${newArgs}` + ".js");
            client.commands.bleed.set(props.help.name, props);
            return message.channel.send("Command \"" + props.help.name + "\" has been loaded into `bleed`.")
          case "cat":
          case "cat-mode":
            props = require(`./cat/${newArgs}` + ".js");
            client.commands.cat.set(props.help.name, props);
            return message.channel.send("Command \"" + props.help.name + "\" has been loaded into `cat`.")
          default:
            return message.channel.send("Branch does not exist.")
        }
      case "module":
        let otherNew = args.slice(cArg[0].length + 1)
        props = require(`../modules/${otherNew}` + ".js");
        return message.channel.send("Module \"" + otherNew + "\" has been loaded.")
    }
  } catch (err) {
    message.channel.send("File was not found.")
  }
}

module.exports.console = async (args) => {
  try {
    let props = require(`./${args}` + ".js");
    client.commands.set(props.help.name, props);
    log("Command \"" + props.help.name + "\" has been loaded.", logging.success, "LOAD")
  } catch (err) {
    log("Command couldn't be found.", logging.error, "LOAD")
  }
}

module.exports.help = {
    name: "load",
    desc: "Load a module into the bot.",
    args: "**(command | module)** (command branch if applicable) **(to load)**",
    parameters: "",
    category: "Owner",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.1.0",
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

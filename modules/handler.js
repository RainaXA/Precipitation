// dependencies
// command :: warn.js      -- create a warning create event against a user (no new warnings can be created)
// command :: rmwarn.js    -- create a warning remove event against a user (no warnings can be removed)
// command :: lswarn.js    -- list all found warnings of a user (warnings cannot even be seen)

let fs = require('fs')

const { Collection } = require('discord.js');

client.commands = new Collection();
client.commands.roll = new Collection();
client.commands.bleed = new Collection();
global.commands = [];

global.loadCommands = function() {
  fs.readdir("./commands", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/")
      log("Commands folder not found - creating now.", logging.warn, "HANDLER")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      let eggCounter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commands/${f}`);
          client.commands.set(props.help.name, props);
          if(props.metadata.types["slash"]) commands.push(props.data.toJSON()) // only push it to be registered if it supports slash
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded command " + props.help.name + ".")
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("Loaded " + counter + " commands. (& " + eggCounter + " easter eggs.)", logging.success, "LOADER")
    }
  })
  fs.readdir("./commands/roll", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/roll/")
      log("Commands folder for roll branch not found - creating now.", logging.warn, "HANDLER")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      let eggCounter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commands/roll/${f}`);
          client.commands.roll.set(props.help.name, props);
          if(props.metadata.types["slash"]) commands.push(props.data.toJSON()) // only push it to be registered if it supports slash
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded roll command " + props.help.name + ".")
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("Loaded " + counter + " roll commands. (& " + eggCounter + " easter eggs.)", logging.success, "LOADER")
    }
  })
  fs.readdir("./commands/bleed", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/bleed/")
      log("Commands folder for bleed branch not found - creating now.", logging.warn, "HANDLER")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      let eggCounter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commands/bleed/${f}`);
          client.commands.bleed.set(props.help.name, props);
          if(props.metadata.types["slash"]) commands.push(props.data.toJSON()) // only push it to be registered if it supports slash
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded bleed command " + props.help.name + ".")
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("Loaded " + counter + " bleed commands. (& " + eggCounter + " easter eggs.)", logging.success, "LOADER")
    }
  })
}
loadCommands();

var branches = {
  stable: 0,
  roll: 1,
  bleed: 2
}

function processCommand(message, cbranch) { // used in editing messages + normal messages
  var fCommand = message.content.slice(messagePrefix.length).split(" ")
  let counter = 0;
  while(fCommand[0] == "") {
    fCommand.shift();
    counter++;
  }
  var command = fCommand[0]
  if(command == undefined) return message.channel.send("Sorry, but it appears this command is unknown.") // crash otherwise
  var args = message.content.slice(messagePrefix.length + command.length + 1 + counter)
  var parameters = args.split("--")
  var parameter = parameters[1]
  if(!parameter) parameter = "precipitation <3" // bot breaks because "toLowerCase()" may not exist
  let cmd;
  switch(cbranch) {
    case branches.stable:
      cmd = client.commands.get(command.toLowerCase())
      break;
    case branches.roll:
      cmd = client.commands.roll.get(command.toLowerCase())
      if(!cmd) cmd = client.commands.get(command.toLowerCase())
      break;
    case branches.bleed:
      cmd = client.commands.bleed.get(command.toLowerCase())
      if(!cmd) cmd = client.commands.roll.get(command.toLowerCase())
      if(!cmd) cmd = client.commands.get(command.toLowerCase())
      break;
  }
  let validCommand = false;
  try {
    if(cmd) {
      validCommand = true;
      if(message.guild) {
        for(permission of cmd.metadata.permissions.bot) {
          if(!message.guild.me.permissions.has(permission)) return message.channel.send("I do not have permission to run this command.")
        }
        for(permission of cmd.metadata.permissions.user) {
          if(!message.member.permissions.has(permission)) return message.channel.send("You do not have permission to run this command.")
        }
      }
      if(cmd.metadata.requireOwner && message.author.id != host.id["owner"]) return message.channel.send("Only the owner may use this command.")
      if(!cmd.metadata.types["message"]) return message.channel.send("This command is not available as a default command.")
      if(!cmd.metadata.allowDM && !message.guild) return message.channel.send("Sorry, but this command is not permitted in a direct message.")
      if(cmd.prereq) cmd.prereq(types.default, message, args);
      cmd.default(message, args, parameter); // else run if old
    } else {
      client.commands.each(cmdd => {
        if (command.toLowerCase() == cmdd.help.alias) { // did you instead run an alias?
          cmd = client.commands.get(cmdd.help.name)
          validCommand = true;
          if(!cmd.metadata.allowDM && !message.guild) return message.channel.send("Sorry, but this command is not permitted in a direct message.")
          cmd.default(message, args, parameter);            // if so, still run it
        }
      })
    }
    if(!validCommand) message.channel.send("Sorry, but it appears this command is unknown.");
  } catch(err) {
    log(err, logging.error, "CATCH")
    let errorEmbed = new MessageEmbed()
    .setTitle("Fatal Exception")
    .setDescription("Here are the logs of the error:")
    .addField("Details", err.stack)
    .setFooter({text: "Precipitation " + host.version.external })
    message.channel.send({embeds: [errorEmbed]})
  }
}

client.on('messageCreate', function(message) {
  let guildBranch = "stable";
  if(message.guild) {
    if(!config.guilds[message.guild.id]) config.guilds[message.guild.id] = {};
    if(!config.guilds[message.guild.id].prefix) config.guilds[message.guild.id].prefix = host.prefix[branch];
    if(!config.guilds[message.guild.id].branch) config.guilds[message.guild.id].branch = "stable";
    guildBranch = config.guilds[message.guild.id].branch
  }
  if (message.content.startsWith("<@" + client.user.id + ">")) {
    global.messagePrefix = "<@" + client.user.id + ">"
  } else if (!message.guild) {
    global.messagePrefix = host.prefix[branch]
  } else {
    global.messagePrefix = config.guilds[message.guild.id].prefix
  }
  if(message.content.toLowerCase().startsWith(messagePrefix) && !message.author.bot) {
    if(!config.users[message.author.id]) config.users[message.author.id] = {}
    if(getTextInput(message.author.id, host.id["blacklisted"])) return message.channel.send("Sorry, but you are blacklisted from the bot. If you feel you've been falsely banned, please make an appeal to <@" + host.id["owner"] + ">.")
    switch(guildBranch) {
      case "stable":
        processCommand(message, branches.stable);
        break;
      case "roll":
        processCommand(message, branches.roll)
        break;
      case "bleed":
        processCommand(message, branches.bleed)
        break;
    }
  }
});

client.on('messageUpdate', function(oldMessage, newMessage) {
  if(oldMessage.content == newMessage.content) return;
  let guildBranch = "stable";
  if(newMessage.guild) {
    if(!config.guilds[newMessage.guild.id]) config.guilds[newMessage.guild.id] = {};
    if(!config.guilds[newMessage.guild.id].prefix) config.guilds[newMessage.guild.id].prefix = host.prefix[branch];
    if(!config.guilds[newMessage.guild.id].branch) config.guilds[newMessage.guild.id].branch = "stable";
    guildBranch = config.guilds[newMessage.guild.id].branch
  }
  if (newMessage.content.startsWith("<@" + client.user.id + ">")) {
    global.messagePrefix = "<@" + client.user.id + ">"
  } else if (!newMessage.guild) {
    global.messagePrefix = host.prefix[branch]
  } else {
    global.messagePrefix = config.guilds[newMessage.guild.id].prefix
  }
  if(newMessage.content.toLowerCase().startsWith(messagePrefix) && !newMessage.author.bot) {
    if(!config.users[newMessage.author.id]) config.users[newMessage.author.id] = {}
    if(getTextInput(newMessage.author.id, host.id["blacklisted"])) return newMessage.channel.send("Sorry, but you are blacklisted from the bot. If you feel you've been falsely banned, please make an appeal to <@" + host.id["owner"] + ">.")
    switch(guildBranch) {
      case "stable":
        processCommand(newMessage, branches.stable);
        break;
      case "roll":
        processCommand(newMessage, branches.roll)
        break;
      case "bleed":
        processCommand(newMessage, branches.bleed)
        break;
    }
  }
})

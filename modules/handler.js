let fs = require('fs')

const { Collection, MessageEmbed } = require('discord.js');

client.commands = new Collection();
client.commands.roll = new Collection();
client.commands.bleed = new Collection();
client.commands.cat = new Collection(); // cat mode..thanks, Nebbyula.
global.commands = [];

global.loadCommands = function() {
  fs.readdir("./commandas", function(error, files) {
    if (error) {
      fs.mkdirSync("./commandas/")
      log("Commands folder not found - creating now.", logging.warn, "HANDLER")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commandas/${f}`);
          if(!props.name) {
            for(item in props) {
              client.commands.set(props[item].name, props[item]);
              counter++;
              if(props[item].execute.slash) commands.push(props[item].data.toJSON())
            }
          } else {
            client.commands.set(props.name, props);
            counter++;
            if(props.execute.slash) commands.push(props.data.toJSON())
          }
          log("Loaded command " + props.name + ".")
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("Loaded " + counter + " new commands.", logging.success, "LOADER")
    }
  })
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
          if(props.metadata.types["slash"]) commands.push(props.data.toJSON()); // only push it to be registered if it supports slash
          let parsedver = props.metadata.version.split(".");
          let parsedbotver = host.version.internal.split(".");
          if(parseInt(parsedver[0]) > parseInt(parsedbotver[0])) log("Command " + props.help.name + " was developed for a future major version of Precipitation. Some functionality may not work. (" + props.metadata.version + " > " + host.version.internal + ")", logging.warn, "LOADER")
          if(parseInt(parsedbotver[1]) > parseInt(parsedver[1]) + 3) log("Command " + props.help.name + " hasn't been updated for some time. It may be a good idea to test this command. (" + host.version.internal + " > " + props.metadata.version + ")", logging.warn, "LOADER")
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded command " + props.name + ".")
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
          let parsedver = props.metadata.version.split(".");
          let parsedbotver = host.version.internal.split(".");
          if(parseInt(parsedver[0]) > parseInt(parsedbotver[0])) log("Roll command " + props.help.name + " was developed for a future major version of Precipitation. Some functionality may not work. (" + props.metadata.version + " > " + host.version.internal + ")", logging.warn, "LOADER")
          if(parseInt(parsedbotver[1]) > parseInt(parsedver[1]) + 3) log("Roll command " + props.help.name + " hasn't been updated for some time. It may be a good idea to test this command. (" + host.version.internal + " > " + props.metadata.version + ")", logging.warn, "LOADER")
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
          let parsedver = props.metadata.version.split(".");
          let parsedbotver = host.version.internal.split(".");
          if(parseInt(parsedver[0]) > parseInt(parsedbotver[0])) log("Bleed command " + props.help.name + " was developed for a future major version of Precipitation. Some functionality may not work. (" + props.metadata.version + " > " + host.version.internal + ")", logging.warn, "LOADER")
          if(parseInt(parsedbotver[1]) > parseInt(parsedver[1]) + 3) log("Bleed command " + props.help.name + " hasn't been updated for some time. It may be a good idea to test this command. (" + host.version.internal + " > " + props.metadata.version + ")", logging.warn, "LOADER")
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
  fs.readdir("./commands/cat", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/cat/")
      log("Commands folder for cat-mode branch not found - creating now.", logging.warn, "HANDLER")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      let eggCounter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commands/cat/${f}`);
          client.commands.cat.set(props.help.name, props);
          if(props.metadata.types["slash"]) commands.push(props.data.toJSON()) // only push it to be registered if it supports slash
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded cat command " + props.help.name + ".")
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("Loaded " + counter + " cat-mode commands. (& " + eggCounter + " easter eggs.)", logging.success, "LOADER")
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
    case branches.cat:
      cmd = client.commands.cat.get(command.toLowerCase())
      if(!cmd) cmd = client.commands.get(command.toLowerCase())
      break;
  }
  let validCommand = false;
  try {
    if(cmd) {
      validCommand = true;
      if(!cmd.help) {
        return cmd.execute.discord(message, args, parameter)
      }
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
    }
    if(!validCommand) message.channel.send("Sorry, but it appears this command is unknown.");
  } catch(err) {
    log(err.stack, logging.error, "CATCH")
    let errorEmbed = new MessageEmbed()
    .setTitle("Fatal Exception")
    .setDescription("Here are the logs of the error:")
    .addField("Details", err)
    .setFooter({text: "Precipitation " + host.version.external })
    message.channel.send({embeds: [errorEmbed]})
  }
}

client.on('messageCreate', function(message) {
  let guildBranch = "stable";
  if(message.guild) {
    if(!config.guilds[message.guild.id]) config.guilds[message.guild.id] = {};
    if(!config.guilds[message.guild.id].prefix) config.guilds[message.guild.id].prefix = host.prefix;
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
      case "cat":
        processCommand(message, branches.cat)
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

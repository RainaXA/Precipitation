/*/
  Precipitation: Multi-purpose modular flexible Discord bot
  Written by Rain

  This is free, open-source software, with no restrictions on use.
  I don't even have a license. I don't care if someone steals this. I develop for the people, and the people can do whatever they'd like with this program.
/*/

const { Client, Intents, MessageEmbed, Permissions, Collection } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require('fs');
const readline = require('readline');
const locations = require("./locations.json")

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var prefix = "pr:"

global.version = {
  "external": "1.0 Blue", // biweekly updates, includes modules and more
  "internal": "1.0.0" // only this index.js file
}

client.commands = new Collection();
client.commands.console = new Collection();
client.commands.slash = new Collection();
var slashCommands = [];

var developer = {
  "startConnect": true,
  "debugging": 0
}

global.getTextInput = function(text) {
  var slurs = ["nigger", "nigga", "retard", "fag", "faggot"]
  for(let i = 0; i < slurs.length; i++) {
    if(text.toLowerCase().includes(slurs[i])) return true;
  }
  return false;
}

function processConsoleCommand() {
  rl.question('', (consoleCommand) => {
    var fcCommand = consoleCommand.split(" ")
    while(fcCommand[0] == "") {
      fcCommand.shift();
    }
    var cCommand = fcCommand[0]
    if(cCommand == undefined) {
      log("Sorry, but it appears this console command is unknown.", logging.info, 0) // crash otherwise
      return processConsoleCommand();
    }
    var args = consoleCommand.slice(fcCommand[0].length + 1)
    let cmd = client.commands.console.get(cCommand.toLowerCase())
    if(cmd) {
      cmd.run(args);
    } else {
      log("Sorry, but it appears this console command is unknown.", logging.info, 0) // crash otherwise
    }
    processConsoleCommand();
  });
}

global.loadCommands = function() {
  fs.readdir("./commands", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/")
      log("Commands folder not found - creating now.", logging.warn, 1)
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      let eggCounter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`./commands/${f}`);
          client.commands.set(props.help.name, props);
          if(props.help.category == "Secrets") { // this is an easter egg
            eggCounter++;
          } else {
            counter++;
          }
          log("Loaded command " + props.help.name + ".", null, 1)
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, 3)
      }
      log("Loaded " + counter + " Discord commands. (& " + eggCounter + " easter eggs.)", logging.success, 0)
    }
  })
  fs.readdir("./commands/slash", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/slash/")
      log("Slash commands folder not found - creating now.", logging.warn, 1)
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`./commands/slash/${f}`);
          client.commands.slash.set(props.data.name, props);
          slashCommands.push(props.data.toJSON())
          counter++;
          log("Loaded command " + props.data.name + ".", null, 1)
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, 3)
      }
      log("Loaded " + counter + " slash commands.", logging.success, 0)
    }
  })
}

global.unloadDiscordCommand = function(command) {
  let cmdExist = false;
  client.commands.each(cmd => {
    if(command == cmd.help.name) {
      cmdExist = true;
      require.resolve('./commands/' + cmd.help.name + '.js')
      client.commands.delete(command)
      log("Unloaded Discord command.", logging.success, 0)
    }
  })
  if(!cmdExist) {
    log("Discord command could not be found.", logging.error, 0)
  }
}

global.loadDiscordCommand = function(command) {
  try {
    let props = require(`./commands/${command}` + ".js");
    client.commands.set(props.help.name, props);
    log("Loaded command " + props.help.name + ".", logging.success, 0)
  } catch (err) {
    log("Sorry, but a Discord command had an error: " + err.stack, logging.error, 3)
  }
}

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (!err) log("Saved settings.", logging.debug, 3, null)
    if (err) log("Settings couldn't be saved!", logging.error, 3, null)
  })
  setTimeout(saveConfiguration, 5000);
}

global.logging = { // based off of AstralMod!
  error: 0,
  warn: 1,
  info: 2,
  success: 3,
  output: 4
}

global.toProperUSFormat = function(month, day, year) {
  let wMonth;
  switch(month) {
    case 1:
      wMonth = "January";
      break;
    case 2:
      wMonth = "February";
      break;
    case 3:
      wMonth = "March";
      break;
    case 4:
      wMonth = "April";
      break;
    case 5:
      wMonth = "May";
      break;
    case 6:
      wMonth = "June";
      break;
    case 7:
      wMonth = "July";
      break;
    case 8:
      wMonth = "August";
      break;
    case 9:
      wMonth = "September";
      break;
    case 10:
      wMonth = "October";
      break;
    case 11:
      wMonth = "November";
      break;
    case 12:
      wMonth = "December";
      break;
  }
  return wMonth + " " + placeValue(day) + ", " + year;
}

global.log = function(message, type, level) {
  let msg;
  switch (type) {
    case logging.error:
      msg = "\x1b[91m[X] " + message
      break;
    case logging.warn:
      msg = "\x1b[93m[!] " + message
      break;
    case logging.info:
      msg = "\x1b[94m[i] " + message
      break;
    case logging.success:
      msg = "\x1b[92m[>] " + message
      break;
    case logging.output:
      msg = "\x1b[97m" + message
      break;
    default:
      msg = "\x1b[95m[-] " + message + "\x1b[0m"
      if(developer.debugging >= level) {
        if(level == developer.debugging) {
          return console.log("\x1b[1m" + msg)
        } else {
          return console.log(msg)
        }
      } else {
        return;
      }
  }
  switch(level) {
    case 1:
      msg = "\x1b[1m" + msg
      break;
    case 2:
      msg = "\x1b[1m\x1b[3m" + msg
      break;
    case 3:
      msg = "\x1b[1m\x1b[3m\x1b[4m" + msg
      break;
  }
  console.log(msg + "\x1b[0m")
}

global.initUser = function(au) {
  if(!config.users[au.id]) {
    config.users[au.id] = {};
  }
  if(!config.users[au.id].birthday) {
    config.users[au.id].birthday = {};
  }
}

function initGuild(guild) {
  if(!config.guilds[guild.id]) {
    config.guilds[guild.id] = {};
  }
  if(!config.guilds[guild.id].prefix) config.guilds[guild.id].prefix = prefix;
  if(!config.guilds[guild.id].filter) config.guilds[guild.id].filter = false;
  if(!config.guilds[guild.id].warnings) config.guilds[guild.id].warnings = {};
}

global.name = function (user) { // modules can change this
  return user.username
}

global.gender = function(user, mMessage, fMessage, oMessage, naMessage) { // male first, female second, others third
  if(oMessage) {
    return oMessage;
  } else {
    return "other";
  }
}

function placeValue(num) {
  let number = parseInt(num)
  if(number.toString().endsWith("11") || number.toString().endsWith("12") || number.toString().endsWith("13")) {
    return number.toString() + "th";
  } else if(number.toString().endsWith("1")) {
    return number.toString() + "st";
  } else if(number.toString().endsWith("2")) {
    return number.toString() + "nd";
  } else if(number.toString().endsWith("3")) {
    return number.toString() + "rd";
  } else {
    return number.toString() + "th";
  }
}

global.find = function(query, when, many, whatToReturn) {
  if(when == "list") {
    let users = client.users.cache
    let list = "";
    let amount = 0;
    let returnValue = 0;
    users.each(user => {
      if(user.tag.toLowerCase().startsWith(query)) {
        if(amount < many) {
          list = list + user.username + "\n"
          amount = amount + 1;
        } else {
          returnValue++;
        }
      }
    })
    if(whatToReturn == "list") {
      if(list == "") {
        return "No results were found."
      } else {
        return list;
      }
    } else if(whatToReturn == "amount") {
      if(returnValue == 0) {
        return "";
      } else {
        return " || There are " + returnValue + " results not shown -- please narrow your query."
      }
    }
  } else if (when == "first") {
    let users = client.users.cache
    let userReturn;
    let amount = 0;
    users.each(user => {
      if(user.tag.toLowerCase().startsWith(query)) {
        if(amount < 1) {
          userReturn = user;
          amount++;
        }
      }
    })
    if(userReturn == null) return null;
    return userReturn;
  }
}

client.on('ready', async() => {
  log('Precipitation has started!', logging.success, 1, null)
  log("Running on version " + version.internal, logging.success, 0)
  client.user.setActivity(version.external + " || " + prefix + "help")
  setTimeout(saveConfiguration, 5000)
  const CLIENT_ID = client.user.id;
  const rest = new REST({
    version: '9'
  }).setToken(config.general.token);
  try {
    await rest.put(
    Routes.applicationCommands(CLIENT_ID), {
      body: slashCommands
    },)
    log('Registered slash commands globally.', logging.success, 0);
  } catch (err) {
    log(err, logging.error, 1)
  }
  processConsoleCommand();
})

if(!fs.existsSync('./config.json')) {
  log('config.json does not exist. Creating now.', logging.warn, 0, null)
  global.config = {
    "guilds": {

    },﻿
    "users": {

    },
    "general": {
      "token": ""
    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
    log('config.json has been created.', logging.success, 0)
    rl.question("Please paste the token: ", (answer) => {
      config.general.token = answer;
      if(developer.startConnect == true) {
        loadCommands();
        client.login(config.general.token)
      } else {
        log("Precipitation is set to start disconnected. (developer.startConnect)", null, 0)
        if(fs.existsSync('./commands/console/login.js')) {
          log("To connect to Discord, run 'login'.", null, 0)
        } else {
          log("To connect to Discord, restart the terminal.", null, 0)
        }
        processConsoleCommand();
      }
    });
  })
} else {
  global.config = JSON.parse(fs.readFileSync("./config.json"));
  if(developer.startConnect == true) {
    loadCommands();
    client.login(config.general.token)
  } else {
    log("Precipitation is set to start disconnected. (developer.startConnect)", null, 0)
    if(fs.existsSync('./commands/console/login.js')) {
      log("To connect to Discord, run 'login'.", null, 0)
    } else {
      log("To connect to Discord, restart the terminal.", null, 0)
    }
    processConsoleCommand();
  }
}

fs.readdir("./commands/console", function(error, files) {
    if (error) {
      if(!fs.existsSync("./commands/")) {
        log("Commands folder not found - creating now.", logging.warn)
        fs.mkdirSync("./commands/")
      }
      log("Console commands folder not found - creating now.", logging.warn)
      fs.mkdirSync("./commands/console/")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`./commands/console/${f}`);
          client.commands.console.set(props.help.name, props);
          log("Loaded console command " + props.help.name + ".", null, 1)
          counter++;
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, 3)
      }
      log("Loaded " + counter + " console commands.", logging.success, 0)
    }
  })

fs.readdir("./modules", function(error, files) {
    if (error) {
      fs.mkdirSync("./modules/")
      log("Modules folder not found - creating now.", logging.warn)
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`./modules/${f}`);
          log("Loaded module " + f.replace(".js", "") + ".", null, 1)
          counter++;
        })
      } catch (err) {
        log("Sorry, but a module had an error: " + err.stack, logging.error, 3)
      }
      log("Loaded " + counter + " modules.", logging.success, 0)
    }
  })

client.on('messageCreate', message => {
  initGuild(message.guild)
  if (message.content.startsWith("<@" + client.user.id + ">")) {
    global.messagePrefix = "<@" + client.user.id + ">"
  } else {
    global.messagePrefix = config.guilds[message.guild.id].prefix
  }
  if (message.content.startsWith(messagePrefix) && !message.author.bot) {
    initUser(message.author)
    if(message.author.id == 238147337568911361) return message.author.send("Sorry, but you've been blacklisted from the bot. If you'd like to be unblacklisted, make an appeal to raina#7847.")
    var fCommand = message.content.slice(messagePrefix.length).split(" ")
    let counter = 0;
    while(fCommand[0] == "") {
      fCommand.shift();
      counter++;
    }
    var command = fCommand[0]
    if(command == undefined) return message.channel.send("Sorry, but it appears this command is unknown.") // crash otherwise
    var args = message.content.slice(messagePrefix.length + fCommand[0].length + 1 + counter)
    var parameters = args.split("--")
    var parameter = parameters[1]
    if(!parameter) parameter = "precipitation <3" // bot breaks because "toLowerCase()" may not exist
    let cmd = client.commands.get(command.toLowerCase())
    let validCommand = false;
    try {
      if(cmd) {
        validCommand = true;
        cmd.run(message, args, parameter); // else run if old
      } else {
        client.commands.each(cmdd => {
          if (command.toLowerCase() == cmdd.help.alias) { // did you instead run an alias?
            cmd = client.commands.get(cmdd.help.name)
            validCommand = true;
            cmd.run(message, args, parameter);            // if so, still run it
          }
        })
      }
      if(!validCommand) message.channel.send("Sorry, but it appears this command is unknown.");
    } catch(err) {
      log(err, logging.error)
      let errorEmbed = new MessageEmbed()
      .setTitle("Fatal Exception")
      .setDescription("Here are the logs of the error:")
      .addField("Details", err)
      .setFooter({text: "Precipitation " + version})
      message.channel.send({embeds: [errorEmbed]})
    }
  }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    let command = client.commands.slash.get(interaction.commandName);
    initGuild(interaction.guild)
    initUser(interaction.user)
    if (!command) return;
    if(interaction.user.id == 238147337568911361) return interaction.reply({ content: "Sorry, but you've been blacklisted from the bot. If you'd like to be unblacklisted, make an appeal to raina#7847.", ephemeral: true })
    try {
        await command.execute(interaction);
    } catch (error) {
        log(error, logging.error, 3);
        let serrorEmbed = new MessageEmbed()
        .setTitle("Fatal Exception")
        .setDescription("Here are the logs of the error:")
        .addField("Details", err)
        .setFooter({text: "Precipitation " + version})
        await interaction.reply({ embeds: [serrorEmbed], ephemeral: true });
    }
});


process.on('uncaughtException', error => {
  log(error.stack, logging.error, 3)
})

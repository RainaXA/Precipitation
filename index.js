/*/
  Precipitation: Multi-purpose modular flexible Discord bot
  Written by Rain

  This is free, open-source software, with no restrictions on use.
  I don't even have a license. I don't care if someone steals this. I develop for the people, and the people can do whatever they'd like with this program.
/*/

const { Client, Intents, MessageEmbed, Permissions, Collection } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
const fs = require('fs');
const readline = require('readline');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

global.host = require("./host.json")

global.logging = { // based off of AstralMod!
  error: 0,
  warn: 1,
  info: 2,
  success: 3,
  output: 4
}

global.types = { // types of commands
  default: 0,
  slash: 1
}

global.log = function(message, type, sender) {
  let msg;
  switch (type) {
    case logging.error:
      msg = "\x1b[91m[ERROR | " + sender + "] " + message
      break;
    case logging.warn:
      msg = "\x1b[93m[WARN | " + sender + "] " + message
      break;
    case logging.info:
      msg = "\x1b[94m[INFO | " + sender + "] " + message
      break;
    case logging.success:
      msg = "\x1b[92m[DONE | " + sender + "] " + message
      break;
    case logging.output:
      msg = "\x1b[97m" + message
      break;
    default:
      if(!host.developer.debugging) return;
      msg = "\x1b[95m[DEBUG] " + message + "\x1b[0m"
  }
  console.log(msg + "\x1b[0m")
}

global.branch = host.developer.branch;
if(branch != "stable" && branch != "roll" && branch != "bleed") {
  branch = "other";
  log("The branch set in host.developer.branch is not valid, defaulting prefix. Please use \"stable\", \"roll\", or \"bleed\".", logging.warn, "BRANCH");
}
var prefix = host.prefix[branch]
log("Current developer branch is " + branch + " - using prefix " + prefix, logging.success, "BRANCH")

global.getTextInput = function(text, list) {
  for(let i = 0; i < list.length; i++) {
    if(text.toLowerCase().includes(list[i])) return true;
  }
  return false;
}

function processConsoleCommand() {
  rl.question('> ', (consoleCommand) => {
    var fcCommand = consoleCommand.split(" ")
    while(fcCommand[0] == "") {
      fcCommand.shift();
    }
    var cCommand = fcCommand[0]
    if(cCommand == undefined) {
      log("Sorry, but it appears this console command is unknown.", logging.info, "CONSOLE") // crash otherwise
      return processConsoleCommand();
    }
    var args = consoleCommand.slice(fcCommand[0].length + 1)
    let cmd = client.commands.get(cCommand.toLowerCase())
    if(cmd) {
      if(!cmd.metadata.types["console"]) {
        log("Sorry, but this command cannot be used in the console.", logging.info, "CONSOLE")
        return processConsoleCommand();
      }
      cmd.console(args);
    } else {
      log("Sorry, but it appears this console command is unknown.", logging.info, "CONSOLE") // crash otherwise
    }
    processConsoleCommand();
  });
}

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (!err) log("Saved settings.", logging.debug)
    if (err) log("Settings couldn't be saved!", logging.error, "CONFIG")
  })
  setTimeout(saveConfiguration, 120000); // save again in 120 seconds
}

if(!fs.existsSync('./config.json')) {
  log('config.json does not exist. Creating now.', logging.warn, "GEN")
  global.config = {
    "guilds": {

    },﻿
    "users": {

    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
    log('config.json has been created.', logging.success, "GEN")
  })
} else {
  global.config = JSON.parse(fs.readFileSync("./config.json"));
}

if(host.developer.startConnect == true) {
  client.login(host.tokens[branch])
} else {
  log("Precipitation is set to start disconnected. (host.developer.startConnect)", "GEN")
  if(fs.existsSync('./commands/console/login.js')) {
    log("To connect to Discord, run 'login'.", "GEN")
  } else {
    log("To connect to Discord, restart the terminal.", "GEN")
  }
  processConsoleCommand();
}

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
    log("Loaded " + counter + " modules.", logging.success, "LOADER")
  }
})

client.on('ready', async() => {
  log('Precipitation has started!', logging.success, "READY")
  log("Running on version " + host.version.internal, logging.success, "READY")
  setTimeout(saveConfiguration, 5000)
  client.guilds.cache.each(guild => {
    if(!config.guilds[guild.id]) {
      config.guilds[guild.id] = {};
      log("Initialized " + guild.name + " as guild.", logging.info, "READY")
    }
  })
  const rest = new REST({
    version: '9'
  }).setToken(host.tokens[branch]);
  try {
    await rest.put(
    Routes.applicationCommands(client.user.id), {
      body: commands
    },)
    log('Registered slash commands globally.', logging.success, "SLASH");
  } catch (err) {
    log(err, logging.error, "SLASH")
  }
  processConsoleCommand();
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    let command = client.commands.get(interaction.commandName);
    if (!command) return;
    if(getTextInput(interaction.user.id, host.id["blacklisted"])) return interaction.reply({ content: "Sorry, but you are blacklisted from the bot. If you feel you've been falsely banned, please make an appeal to <@" + host.id["owner"] + ">.", ephemeral: true })
    if(!command.metadata.allowDM && !interaction.guild) return interaction.reply({ content: "Sorry, but this command is not permitted in a direct message.", ephemeral: true })
    if(interaction.guild) {
      for(permission of command.metadata.permissions.bot) {
        if(!interaction.guild.me.permissions.has(permission)) return interaction.reply({ content: "I do not have permission to run this command."})
      }
      for(permission of command.metadata.permissions.user) {
        if(!interaction.member.permissions.has(permission)) return interaction.reply({ content: "You do not have permission to run this command."})
      }
    }
    if(command.prereq) await command.prereq(types.slash, interaction);
    await command.slash(interaction);
});


process.on('uncaughtException', error => {
  log(error.stack, logging.error, "CATCH")
})

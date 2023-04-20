/* ========================================================================= *\
    Precipitation: multi-purpose modular Discord bot
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

const { Client, Intents } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, ], partials: ["CHANNEL"] });
const fs = require('fs');
const blessed = require('blessed');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

global.host = require("./host.json")

var screen = blessed.screen({
  smartCSR: true
});
screen.title = 'Precipitation ' + host.version.external;

var titleBox = blessed.text({
  top: "0",
  left: "0",
  width: "100%",
  height: "1",
  content: "Precipitation " + host.version.external + " " + host.version.name,
  tags: true,
  style: {
      fg: 'white',
      bg: host.color.toLowerCase()
  },
  padding: {
      left: 1
  }
});
screen.append(titleBox);

var logBox = blessed.log({
  top: 1,
  left: 0,
  width: "100%",
  height: "100%-4",
  tags: true,
  style: {
      fg: 'white',
      bg: 'black',
      scrollbar: {
          bg: 'white'
      }
  },
  padding: {
      left: 2
  },
  keys: true,
  vi: true,
  scrollable: true,
  alwaysScroll: true,
  scrollOnInput: true,
  scrollbar: {
    style: {
      bg: host.color.toLowerCase()
    }
  }
});
screen.append(logBox);

global.textBox = blessed.textbox({
  top: "100%-2",
  left: -1,
  width: "100%+2",
  height: 3,
  tags: true,
  value: "> ",
  border: {
      type: "line"
  },
  style: {
      fg: 'white',
      bg: 'black',
      border: {
          fg: 'white',
          bg: 'black'
      }
  },
  inputOnFocus: true
});
screen.append(textBox);
textBox.focus();

textBox.key('pageup', function() {
  logBox.scroll(-logBox.height);
  screen.render();
})

textBox.key('pagedown', function() {
  logBox.scroll(logBox.height);
  screen.render();
})

textBox.key('up', function() {
  logBox.scroll(-1);
  screen.render();
})

textBox.key('down', function() {
  logBox.scroll(1);
  screen.render();
})

textBox.on('submit', function() {
  let cmd = textBox.getText().slice(2)
  let thing = "> ";
  if(currentDirectory) {
    cmd = textBox.getText().slice(2 + currentDirectory.length)
    thing = currentDirectory + "> "
  }
  
  log("> " + cmd, logging.input)
  textBox.setValue(thing);
  textBox.focus();

  var fcCommand = cmd.split(" ")
  while(fcCommand[0] == "") {
    fcCommand.shift();
  }
  if(fcCommand[0] == undefined) return log("Sorry, but it appears this console command is unknown.", logging.info, "console") // crash otherwise
  var args = cmd.slice(fcCommand[0].length + 1)
  let command = client.commands.get(fcCommand[0].toLowerCase())
  if(command) {
    if(!command.execute.console) {
      return log("Sorry, but this command cannot be used in the console.", logging.info, "console")
    }
    command.execute.console(args);
  } else {
    log("Sorry, but it appears this console command is unknown.", logging.info, "console") // crash otherwise
  }
})

screen.render()

global.logging = { // based off of AstralMod!
  error: 0,
  warn: 1,
  info: 2,
  success: 3,
  output: 4,
  input: 5
}

global.log = function(message, type, sender) {
  let msg;
  switch (type) {
    case logging.error:
      msg = "\x1b[91m" + sender + ": " + message
      break;
    case logging.warn:
      msg = "\x1b[93m" + sender + ": " + message
      break;
    case logging.info:
      msg = "\x1b[94m" + sender + ": " + message
      break;
    case logging.success:
      msg = "\x1b[92m" + sender + ": " + message
      break;
    case logging.output:
      msg = "\x1b[97m" + sender + ": " + message
      break;
    case logging.input:
      msg = "\x1b[37m" + message
      break;
    default:
      if(!host.developer.debugging) return;
      msg = "\x1b[95m[DEBUG] " + message
  }
  logBox.log(msg + "\x1b[0m")
}

global.getTextInput = function(text, list, type) { // true = don't check caps 
  if(!type) { // case-insensitive
    for(let i = 0; i < list.length; i++) {
      if(text.toLowerCase().includes(list[i])) return true;
    }
  } else if (type == 1) { // case-sensitive
    for(let i = 0; i < list.length; i++) {
      if(text.includes(list[i])) return true;
    }
  } else if (type == 2) { // numerical or other non-string
    for(let i = 0; i < list.length; i++) {
      if(text == list[i]) return true;
    }
  } else if (type == 3) { // remove spaces, case-insensitive
    for(let i = 0; i < list.length; i++) {
      if(text.replace(/\s+/g, '').toLowerCase().includes(list[i])) return true;
    }
  }
  return false;
}

global.saveConfiguration = function() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (!err) log("Saved settings.", logging.debug)
    if (err) log("Settings couldn't be saved!", logging.error, "config")
  })
  setTimeout(saveConfiguration, 120000); // save again in 120 seconds
}

if(!fs.existsSync('./config.json')) {
  log('config.json does not exist. Creating now.', logging.warn, "config")
  global.config = {
    "guilds": {

    },﻿
    "users": {

    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
    log('config.json has been created.', logging.success, "config")
  })
} else {
  global.config = JSON.parse(fs.readFileSync("./config.json"));
}

if(host.developer.startConnect == true) {
  client.login(host.token)
} else {
  log("Precipitation is set to start disconnected. (host.developer.startConnect)", "GEN")
  if(fs.existsSync('./commands/console/login.js')) {
    log("To connect to Discord, run 'login'.", "GEN")
  } else {
    log("To connect to Discord, restart the terminal.", "GEN")
  }
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
    log("loaded " + counter + " modules.", logging.success, "modules")
  }
})

client.on('ready', async() => {
  log('successfully started precipitation', logging.success, "ready")
  log("running on version " + host.version.internal, logging.success, "ready")
  log("running in " + client.guilds.cache.size + " guilds, with " + client.users.cache.size + " total users", logging.info, "ready");
  setTimeout(saveConfiguration, 120000)
  client.guilds.cache.each(guild => {
    if(!config.guilds[guild.id]) {
      config.guilds[guild.id] = {};
      log("Initialized " + guild.name + " as guild.", logging.info, "ready")
    }
  })
  const rest = new REST({
    version: '9'
  }).setToken(host.token);
  try {
    await rest.put(
    Routes.applicationCommands(client.user.id), {
      body: commands
    },)
    log('Registered slash commands globally.', logging.success, "SLASH");
  } catch (err) {
    log(err, logging.error, "SLASH")
  }
})

client.on('guildCreate', function(guild) {
  config.guilds[guild.id] = {};
  log("initialized new guild " + guild.name, logging.info, "guilds")
})

process.on('uncaughtException', error => {
  log(error.stack, logging.error, "catch")
})

client.on('error', error => {
  log(error.stack, logging.error, "catch")
})
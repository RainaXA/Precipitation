/*/
  Precipitation: Multi-purpose modular flexible Discord bot
  Written by Rain

  This is free, open-source software, with no restrictions on use.
  I don't even have a license. I don't care if someone steals this. I develop for the people, and the people can do whatever they'd like with this program.
/*/

const { Client, Intents } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES], partials: ["CHANNEL"] });
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
      bg: 'blue'
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
      bg: 'blue'
    }
  }
});
screen.append(logBox);

var textBox = blessed.textbox({
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
  var cmd = textBox.getText().slice(2);

  log("> " + cmd, logging.input)
  textBox.setValue("> ");
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

global.types = { // types of commands
  default: 0,
  slash: 1
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
    log("Loaded " + counter + " modules.", logging.success, "modules")
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

process.on('uncaughtException', error => {
  log(error.stack, logging.error, "catch")
})

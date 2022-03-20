const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const readline = require('readline');

var prefix = "pr:" // pr; in the official Precipitation, modified for the source code
var version = "v0.0.2.2"
var verText = "the robot revolution"

var debugging = 0;

client.login('[token]')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function processConsoleCommand() {
  rl.question('', (answer) => {
    switch (answer) {
      case "ping":
        log("Hello!\n", "output", 0)
        break;
      case "help":
        log("\nPrecipitation Help Index", "output", 3)
        log("General", "output", 1)
        log("ping", "output", 0)
        log("help", "output", 0)
        log("e\n", "output", 0)
    }
    if(answer.startsWith("e ")) {
      let cmd = answer.slice(2)
      eval(cmd)
    }
    processConsoleCommand();
  });
}

function log(message, type, level) { // not much of a place in here, might get rid of it on final update
  // debug level: will only display if the current debugging level is >= the level set on the log

  // rule of thumb:
  // level 0 debugging: should be used most of the time, will log next to nothing
  // level 1 debugging: will log specific areas that are known to cause trouble, or may not be very stable (always changing)
  // level 2 debugging: logs new changes, describes most of what the bot is doing
  // level 3 debugging: logs ALL messages that begin with the bot prefix
  let msg;
  switch (type) {
    case "error":
      msg = ("[X] " + message).brightRed
      break;
    case "warn":
      msg = ("[!] " + message).brightYellow
      break;
    case "info":
      msg = ("[i] " + message).brightBlue
      break;
    case "success":
      msg = ("[>] " + message).brightGreen
      break;
    case "unknown":
      msg = ("[?] " + message).brightCyan
      break;
    case "output":
      msg = (message).brightWhite
      break;
    case "debug": // we are intentionally not going to be able to identify someone -- there is no database for their consent!!
      msg = ("[-] " + message).brightMagenta
      break;
  }
  if (type != "debug") {
    switch(level) {
      case 0:
      default:
        break;
      case 1:
        msg = msg.bold
        break;
      case 2:
        msg = msg.bold.italic
        break;
      case 3:
        msg = msg.bold.italic.underline
        break;
    }
    console.log(msg)
  } else {
    if(debugging >= level) {
      if(level == debugging) {
        console.log(msg.bold)
      } else {
        console.log(msg)
      }
    }
  }
}

function placeValue(num) { // no place in here, but it's a feature in v0.1, which doesn't require a database
  let number = num.toString()
  if(number.endsWith("11") || number.endsWith("12") || number.endsWith("13")) {
    return number + "th";
  } else if(number.endsWith("1")) {
    return number + "st";
  } else if(number.endsWith("2")) {
    return number + "nd";
  } else if(number.endsWith("3")) {
    return number + "rd";
  } else {
    return number + "th";
  }
}

client.on('ready', () => {
  log('Precipitation has started!', 'success', 1)
  client.user.setActivity(version + " || " + prefix + "help")
  processConsoleCommand();
})

client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith(prefix)) {
    var command = message.content.slice(prefix.length)
    var parameters = command.split("--")
    switch (command.toLowerCase()) {
      case "ping":
        let username = message.author.username;
        let startTime = Date.now();
        let rng = Math.floor(Math.random() * 6)
        let pingMessage;
        switch (rng) {
          case 0:
            pingMessage = "Pinging..."
            break;
          case 1:
            pingMessage = "yeah i got you"
            break;
          case 2:
            pingMessage ﻿= "awooga"
            break;
          case 3:
            pingMessage = "i'm so random and quirky!!!"
            break;
          case 4:
            pingMessage = "ew are you a pisces? that makes you satan!"
            break;
          case 5:
            pingMessage = "i'm a scorpio so it makes sense for me to kill my whole family"
            break;
        }
        message.channel.send("<:ping_receive:502755206841237505> " + pingMessage).then(function(message) {
          let endTime = Date.now() - startTime
          message.edit("<:ping_transmit:502755300017700865> (" + endTime + "ms) Hey, " + username + "!");
        })
        break;
      case "help": // standalone help
        let helpEmbed = new MessageEmbed()
        .setTitle("Precipitation Index")
        .setDescription('List of all commands -- use `' + prefix + '` before all commands!')
        .addFields(
          { name: "General", value: "ping\nhelp\nversion\nabout\nplacevalue" }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [helpEmbed]})
        break;
      case "about":
        let aboutEmbed = new MessageEmbed()
        .setTitle("Precipitation " + version)
        .setDescription('Kinda cool hybrid moderation-fun bot')
        .addFields(
          { name: "Creator", value: "**raina#7847** - bot developer" },
          { name: "Version Support", value: "**Older Stable**: given some updates from newer version"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [aboutEmbed]})
        break;
      case "gtest":
      case "btest":
      case "location":
      case "ltest":
        // message.channel.send("Please use the prefix, `pr:` -- Precipitation v0.0.2.2 does not support databases.");
        // this is for use in the official Precipitation, where v0.0.2.2 is hosted alongside v0.1
        // Adding a database to Precipitation v0.0.2.2 would just mean that it's v0.1.0
    }
    if(command.startsWith("name") || command.startsWith("gender ") || command.startsWith("location ") || command.startsWith("birthday ")) {
        // message.channel.send("Please use the prefix, `pr:` -- Precipitation v0.0.2.2 does not support databases.");
        // this is for use in the official Precipitation, where v0.0.2.2 is hosted alongside v0.1
        // Adding a database to Precipitation v0.0.2.2 would just mean that it's v0.1.0
    } else if(command.startsWith("placevalue ")) {
      let cmd = command.slice(11)
      if(isNaN(parseInt(cmd))) return message.channel.send("Please input a number.")
      if(cmd.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
      message.channel.send(placeValue(cmd))
    } else if (command.startsWith("ver") || command.startsWith("version")) {
      if(parameters[1] == "no-ver-text") {
        message.channel.send("Precipitation " + version)
      } else {
        message.channel.send("Precipitation " + version + ": " + verText + ".");
      }
    }
  }
})

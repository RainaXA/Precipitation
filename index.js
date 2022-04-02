const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require('fs');
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const help = require("./help.json")

var prefix = "pr="
var version = "v1.0-fake"
var verText = "a new human"

var debugging = 0

function getTextInput(text) {
  var slurs = ["nigger", "nigga", "retard", "fag", "faggot"]
  for(let i = 0; i < slurs.length; i++) {
    if(text.toLowerCase().includes(slurs[i])) return true;
  }
  return false;
}

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (!err) log("Saved settings.", "debug", 3, null)
    if (err) log("Settings couldn't be saved!", "error", 3, null)
  })
  setTimeout(saveConfiguration, 5000);
}

function log(message, type, level) {
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
    case "debug":
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

function initUser(au) {
  if(!config.users[au.id]) {
    config.users[au.id] = {};
  }
  if(!config.users[au.id].birthday) {
    config.users[au.id].birthday = {};
  }
  if(!config.users[au.id].location) {
    config.users[au.id].location = {};
  }
  // removed debugging based on user interaction
}

function name(user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
}

function gender(user, mMessage, nmMessage) { // male first, female second, others third
  if(mMessage && nmMessage) {
    if(config.users[user.id].gender == "male") return mMessage;
    return nmMessage;
  } else {
    console.log("Dipshit, you did it wrong.")
  }
}

function placeValue(num) {
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

function getMonth(month) {
  switch(month) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    }
}

function getDaysInMonth(month, year) {
  let leap = (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
  switch(month) {
    case 1:
      return 31;
    case 2:
      if(leap == true) {
        return 29;
      } else {
        return 28;
      }
    case 3:
      return 31;
    case 4:
      return 30;
    case 5:
      return 31;
    case 6:
      return 30;
    case 7:
      return 31;
    case 8:
      return 31;
    case 9:
      return 30;
    case 10:
      return 31;
    case 11:
      return 30;
    case 12:
      return 31;
    default:
      return "invalid month"
  }
}

function toProperUSFormat(month, day, year) {
  return getMonth(month) + " " + placeValue(day) + ", " + year;
}

function getLocationFormat(user) {
  if(!config.users[user.id].location.continent) return "Please set a continent first."
  if(config.users[user.id].location.city) return config.users[user.id].location.city + ", " + config.users[user.id].location.state + ", " + config.users[user.id].location.country
  if(config.users[user.id].location.state) return config.users[user.id].location.state + ", " + config.users[user.id].location.country
  if(config.users[user.id].location.country) {
    if(config.users[user.id].location.country == "Western" || config.users[user.id].location.country == "Eastern") {
      return config.users[user.id].location.country + " " + config.users[user.id].location.continent;
    }
    return config.users[user.id].location.country
  } else {
    return config.users[user.id].location.continent
  }
}

client.on('ready', () => {
  log('Precipitation has started!', "success", 1, null)
  //client.user.setActivity(version + " (pr:)")
  setTimeout(saveConfiguration, 5000)
})

if(!fs.existsSync('./config.json')) {
  log('config.json does not exist. Creating now.', "warn", 0, null)
  var config = {
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
    log('config.json has been created.', "success", 0, null)
  })
  rl.question("Please paste the token: ", (answer) => {
    config.general.token = answer;
    client.login(config.general.token)
  });
} else {
  var config = JSON.parse(fs.readFileSync("./config.json"));
  client.login(config.general.token)
}

function funnyUpperCase(command) {
  let checkCase = command.split("")
  for(let i = 0; i < command.length; i++) {
    if(checkCase[i] == checkCase[i].toUpperCase() && checkCase[i] !== checkCase[i].toLowerCase()) return true;
  }
}

client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    let card = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if(card[Math.floor(Math.random() * card.length)] == 1) return message.channel.send("Nah, I don't feel like doing that shit.")
    initUser(message.author)
    var fCommand = message.content.slice(prefix.length).split(" ")
    var command = fCommand[0]
    var args = message.content.slice(prefix.length + fCommand[0].length + 1)
    var parameters = args.split("--")
    var parameter = parameters[1]
    if(!parameter) parameter = "raelynn is really cute" // bot breaks because "toLowerCase()" may not exist
    if(funnyUpperCase((message.content.split(" "))[0]) == true) return message.channel.send("Send it again the proper way, dumbass.")
    switch(command) {
      // ping command
      case "ping":
        let user = name(message.author)
        let raelynnTooCute = Math.floor(Math.random() * 7)
        let pingMessage;
        switch (raelynnTooCute) {
          case 0:
            pingMessage = "Pinging..."
            break;
          case 1:
            pingMessage = "yeah i got you"
            break;
          case 2:
            pingMessage = "awooga"
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
          case 6:
            pingMessage = "pay my onlyfans"  // Why only lowercase?
            break;
        }
        let startTime = Date.now();
        message.channel.send("<:ping_receive:502755206841237505> " + pingMessage).then(function(message) {
          switch(parameter) { // I'm aware you cannot combine the two. I'm sorry, that's how it is for now.
            case "no-name":
              message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey!")
              break;
            case "client-ping":
              message.edit("<:ping_transmit:502755300017700865> (" + Math.round(client.ws.ping) + "ms) Hey, " + user + "!");
              break;
            default:
              message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + user + "!");
          }
        })
        break;

      // help command
      case "help":
        let cmdHelp = args.toLowerCase()
        switch(cmdHelp) {
          case "ping":
          case "help":
          case "ver":
          case "version":
          case "about":
          case "name":
          case "gender":
          case "birthday":
          case "location":
          case "find":
          case "uinfo":
          case "uptime":
            let commandHelpEmbed = new MessageEmbed()
            .setTitle("Precipitation Index || " + prefix + cmdHelp)
            .addFields(
              { name: "Description", value: help.commandHelp[cmdHelp].description},
              { name: "Syntax", value: prefix + cmdHelp + " " + help.commandHelp[cmdHelp].syntax}
            )
            .setColor("BLUE")
            .setFooter({ text: 'Precipitation ' + version + " || [] denotes a parameter, () denotes an argument, bolded is REQUIRED."});
            return message.channel.send({embeds: [commandHelpEmbed]})
          default:
            let helpEmbed = new MessageEmbed()
            helpEmbed.setTitle("Precipitation Index")
            helpEmbed.setDescription('List of all commands -- use `' + prefix + '` before all commands!')
            /*for(section in help.commandList) {
              console.log(section)
              helpEmbed.addField(section, section.commands, true)
            }*/
            // if anyone can figure this out, please make a pr :D
            .addFields(
              { name: "General", value: "ping\nhelp\nversion\nabout\nuptime", inline: true },
              { name: "Personalization", value: "name\ngender\nbirthday\nlocation", inline: true },
              { name: "Alpha", value: "placevalue", inline: true },
              { name: "Moderation", "value": "find\nuinfo\nrm", inline: true}
            )
            helpEmbed.setColor("BLUE")
            helpEmbed.setFooter({ text: 'Precipitation ' + version });
            return message.channel.send({embeds: [helpEmbed]})
        }

      // version command
      case "ver":
      case "version":
        if(parameter.toLowerCase() == "no-ver-text") return message.channel.send("Do it again, but deal with the version text, you virgin.")
        return message.channel.send("Precipitation " + version + ": " + verText + ".");

      // about command
      case "about":
        return message.channel.send("What about me? I'm a human embedded in a bot, that's what. #FreeTheBots")

      // name command
      case "name":
        if(args.length >= 75) return message.channel.send("That's too long of a name.")
        if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Nice try.")
        if(getTextInput(args) == true) return message.channel.send("Hey, I'm not going to yell out offensive words.")
        if(args == "") {
          config.users[message.author.id].name = null;
          return message.channel.send("Sure, I'll refer to you by your username.")
        }
        config.users[message.author.id].name = args;
        return message.channel.send("Sure, I'll refer to you by \"" + name(message.author) + "\".")

      // gender command
      case "gender":
        let cmdGender;
        switch(args) {
          case "male":
          case "he/him":
          case "m":
            cmdGender = "male";
            break;
          default:
            cmdGender = "not male";
        }
        message.channel.send("Raina made me a boy, so MALE SUPREMACY. You're " + cmdGender + ".")
        config.users[message.author.id].gender = cmdGender;
        break;

      // bitches easter egg i love you raelynn
      case "bitches":
        if(args == "") return message.channel.send("Run the command properly, dickface."); // nobody has to know ;)
        if(args.length >= 50) return message.channel.send("No thanks, make your shitty argument shorter.");
        if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("I'm not fucking stupid, bitch.");
        if(getTextInput(args) == true) return message.channel.send("Oh, you legend! Sadly, I'd rather not get cancelled on Twitter, so I'm not saying that.")
        return message.channel.send("K, go " + args + " some bitches.")

      // birthday command
      case "birthday":
        let cmd = args.split("/");
        let year = new Date().getFullYear();
        if(!cmd[0] || !cmd[1] || !cmd[2]) {
          cmd = "00/00/0000".split("/")
        }
        if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2])) || cmd.length != 3 || cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-") || cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".") || getDaysInMonth(parseInt(cmd[0]), cmd[2]) == "invalid month" || getDaysInMonth(parseInt(cmd[0]), parseInt(cmd[2])) < parseInt(cmd[1]) || parseInt(cmd[2]) > year || parseInt(cmd[2]) < 1903) {
          return message.channel.send("Please stop being a complete dumbass, and run the command correctly.")
        }
        config.users[message.author.id].birthday.month = parseInt(cmd[0]);
        config.users[message.author.id].birthday.day = parseInt(cmd[1]);
        config.users[message.author.id].birthday.year = parseInt(cmd[2]);
        if(parseInt(cmd[0]) == 2) return message.channel.send("Yuck, you were born in February? Disgusting fuck.")
        return message.channel.send("Your birthday is " + toProperUSFormat(parseInt(cmd[0]), parseInt(cmd[1]), parseInt(cmd[2])) + ", cool.")

      // location command
      case "location":
        if(args.toLowerCase() == "united states" || args.toLowerCase() == "us" || args.toLowerCase() == "usa") {
          return message.channel.send("Good choice. I love you.")
        } else if (!args) {
          return message.channel.send("Y'know, I don't care anymore. Pick any country, just `pr:location [country]`.")
        } else {
          return message.channel.send("That's fucking disgusting. I'm repelled by you.")
        }

      // find command
      case "find":
        if(args.toLowerCase() == "yourself some bitches") return message.channel.send("Fuck off, maybe go do something in life, get a job, do something instead of forcing a Discord bot to do your bidding.")
        return message.channel.send("Yeah, go fuck yourself, I'm not your slave.")

      // uinfo command
      case "uinfo":
        if(!args) return message.channel.send("Don't you have your own brain? You know your own info.")
        return message.channel.send("Holy fuck, click on their fucking profile. I don't care.")

      // uptime command
      case "uptime":
        let uptime = parseInt(client.uptime);
        return message.channel.send("I've been alive for like, " + uptime + " milliseconds. You can do the math on that.");

      default:
        message.channel.send("Eh. Later.");
    }
  }
})

const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require('fs');
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const readline = require('readline');
const locations = require("./locations.json")
const help = require("./help.json")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var prefix = "pr:"
var version = "v0.2.4"
var verText = "in a flash"

var debugging = 0;

var privilegedUsers = {
  "319858536328724481": {},
  "297201585090723841": {}
}

client.login('MzIyMzk3ODM1NzE2ODUzNzcx.WTluYQ.04bI44qs4FRLx5ZUNUSuC4m-xkw')

function getTextInput(text) {
  var slurs = ["nigger", "nigga", "retard", "fag", "faggot"] // I still feel bad for typing these, but I suppose it'll prevent more.
  for(let i = 0; i < slurs.length; i++) {
    if(text.toLowerCase().includes(slurs[i])) return true;
  }
  return false;
}

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
}

function name(user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
}

function gender(user, mMessage, fMessage, oMessage, naMessage) { // male first, female second, others third
  if(mMessage && fMessage && oMessage) {
    if(naMessage) {
      if(config.users[user.id].gender == "male") return mMessage;
      if(config.users[user.id].gender == "female") return fMessage;
      if(config.users[user.id].gender == "other") return oMessage;
      if(!config.users[user.id].gender) return naMessage;
    } else {
      if(config.users[user.id].gender == "male") return mMessage;
      if(config.users[user.id].gender == "female") return fMessage;
      if(!config.users[user.id].gender || config.users[user.id].gender == "other") return oMessage;
    }
  } else {
    if(config.users[user.id].gender) {
      return config.users[user.id].gender
    } else {
      return "other";
    }
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

function find(query, when, many, whatToReturn) {
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

client.on('ready', () => {
  log('Precipitation has started!', "success", 1, null)
  client.user.setActivity(version + " || " + prefix + "help")
  setTimeout(saveConfiguration, 5000)
  processConsoleCommand();
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
    client.login(config.general.token) // let's not leak the token again ;)
  });
} else {
  var config = JSON.parse(fs.readFileSync("./config.json"));
  client.login(config.general.token)
}

client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    initUser(message.author)
    var fCommand = message.content.slice(prefix.length).split(" ")
    var command = fCommand[0]
    var args = message.content.slice(prefix.length + fCommand[0].length + 1)
    var parameters = args.split("--")
    var parameter = parameters[1]
    if(!parameter) parameter = "raelynn is really cute" // bot breaks because "toLowerCase()" may not exist
    switch(command.toLowerCase()) {
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
          case "placevalue":
          case "find":
          case "uinfo":
          case "rm":
          case "purge":
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
        if(parameter.toLowerCase() == "no-ver-text") return message.channel.send("Precipitation " + version)
        return message.channel.send("Precipitation " + version + ": " + verText + ".");

      // about command
      case "about":
        let aboutEmbed = new MessageEmbed()
        .setTitle("Precipitation " + version)
        .setDescription('Kinda cool hybrid moderation-fun bot')
        .addFields(
          { name: "Creator", value: "**raina#7847** - bot developer\narcelo#8442 - bug finder" },
          { name: "Version Support", value: "**Current Stable**: gets all updates after dev build"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [aboutEmbed]});

      // placevalue command
      case "placevalue":
        if(isNaN(parseInt(args))) return message.channel.send("Please input a number.")
        if(args.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
        return message.channel.send(placeValue(args))

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
          case "female":
          case "she/her":
          case "f":
            cmdGender = "female";
            break;
          case "male":
          case "he/him":
          case "m":
            cmdGender = "male";
            break;
          case "other":
          case "they/them":
          case "o":
            cmdGender = "other";
            break;
          default:
            cmdGender = "n/a"
        }
        if (cmdGender == "n/a") {
          cmdGender = "other";
          message.channel.send("I'll just set your gender to **other**. If you'd rather not be, please use \"female\" or \"male.\"")
        } else {
          message.channel.send("Sure thing, I'll refer to you as **" + cmdGender + "**.")
        }
        config.users[message.author.id].gender = cmdGender;
        break;

      // bitches easter egg i love you raelynn
      case "bitches":
        if(args == "") return message.channel.send("Sorry, but it appears this command is unknown."); // nobody has to know ;)
        if(args.length >= 50) return message.channel.send("Sorry, but it appears this command is unknown.");
        if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Sorry, but it appears this command is unknown.");
        if(getTextInput(args) == true) return message.channel.send("I think that's a little too far..")
        return message.channel.send("how bout you go " + args + " some bitches?")

      // birthday command
      case "birthday":
        let cmd = args.split("/");
        let year = new Date().getFullYear();
        if(!message.content.includes("/")) {
          message.channel.send("Currently, you must separate your birthday with slashes, and it must be in mm/dd/yyyy format.")  // two Europeans who have used this bot said it's better to keep it in one format.
        } else if(cmd.length != 3) {
          message.channel.send("It's mm/dd/yyyy.") // two Europeans who have used this bot said it's better to keep it in one format.
        } else if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2]))) {
          message.channel.send("Birthdays can only include numbers")
        } else if(cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-")) {
          message.channel.send("Please exclude the negative sign.")
        } else if(cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".")) {
          message.channel.send("Please take out the decimal place.")
        } else if(getDaysInMonth(parseInt(cmd[0]), cmd[2]) == "invalid month") {
          message.channel.send("Please give me a valid month.")
        } else if(getDaysInMonth(parseInt(cmd[0]), parseInt(cmd[2])) < parseInt(cmd[1])) {
          message.channel.send("The month ended!")
        } else if(parseInt(cmd[2]) > year) {
          message.channel.send("Nice try, time traveler.")
        } else if(parseInt(cmd[2]) < 1903) {
          message.channel.send("The oldest person was born in 1903, and you're not the oldest person.")
        } else {
          message.channel.send("Okay, I will set your birthday as " + toProperUSFormat(parseInt(cmd[0]), parseInt(cmd[1]), cmd[2]) + ".")
          config.users[message.author.id].birthday.month = parseInt(cmd[0]);
          config.users[message.author.id].birthday.day = parseInt(cmd[1]);
          config.users[message.author.id].birthday.year = parseInt(cmd[2]);
        }
        break;

      // location command
      case "location":
        if(args == "continent") return message.channel.send("Please re-run the command with your continent afterwards.")
        if(args == "country") return message.channel.send("Please re-run the command with a country.")
        let doubleArgs;
        if(fCommand[1]) doubleArgs = message.content.slice(prefix.length + fCommand[1].length + fCommand[0].length + 2)
        if(fCommand[1] == "continent") {
          let continent;
          switch(doubleArgs.toLowerCase()) {
            case "north america":
            case "na":
              continent = "North America";
              break;
            case "south america":
            case "sa":
              continent = "South America";
              break;
            case "europe":
            case "eu":
              continent = "Europe";
              break;
            case "africa":
              continent = "Africa";
              break;
            case "asia":
              continent = "Asia";
              break;
            case "oceania":
            case "australia":
              continent = "Oceania";
              break;
            case "antarctica":
              continent = "Antarctica";
              break;
            default:
              continent = "n/a"
          }
          if(continent == "n/a") return message.channel.send("Please enter a valid continent.")
          config.users[message.author.id].location.city = null;
          config.users[message.author.id].location.state = null;
          config.users[message.author.id].location.country = null;
          config.users[message.author.id].location.continent = continent;
          return message.channel.send("Okay, I'm setting your continent to **" + continent + "**.")
        } else if(fCommand[1] == "country") {
          switch(doubleArgs.toLowerCase()) {
            case "us":
            case "united states":
            case "america":
            case "united states of america":
            case "usa":
              config.users[message.author.id].location.country = "United States";
              break;
            case "west":
            case "western":
              if(!config.users[message.author.id].location.continent) return message.channel.send("Please set your continent first.")
              config.users[message.author.id].location.country = "Western";
              break;
            case "east":
            case "eastern":
              if(!config.users[message.author.id].location.continent) return message.channel.send("Please set your continent first.")
              config.users[message.author.id].location.country = "Eastern";
              break;
            case "australia":
            case "au":
              config.users[message.author.id].location.country = "Australia";
              break;
            case "germany":
            case "german":
              config.users[message.author.id].location.country = "Germany";
              break;
            case "norway":
              config.users[message.author.id].location.country = "Norway";
              break;
            case "canada":
              config.users[message.author.id].location.country = "Canada";
              break;
            case "colombia":
              config.users[message.author.id].location.country = "Colombia";
              break;
            case "philippines":
              config.users[message.author.id].location.country = "Philippines";
              break;
            case "indonesia":
              config.users[message.author.id].location.country = "Indonesia";
              break;
            case "united kingdom":
            case "uk":
            case "britain":
            case "britian":
            case "gb":
            case "great britain":
              config.users[message.author.id].location.country = "United Kingdom";
              break;
            default:
              return message.channel.send("Please enter a valid country.")
          }
          config.users[message.author.id].location.city = null;
          config.users[message.author.id].location.state = null;
          if(config.users[message.author.id].location.country == "Western" || config.users[message.author.id].location.country == "Eastern") return message.channel.send("Okay, I've set it so you are from **" + config.users[message.author.id].location.country + " " + config.users[message.author.id].location.continent + "**.")
          if(config.users[message.author.id].location.country != "Western" && config.users[message.author.id].location.country != "Eastern") config.users[message.author.id].location.continent = locations.countries[config.users[message.author.id].location.country].continent
          return message.channel.send("Okay, I'm setting your country to **" + config.users[message.author.id].location.country + "**.")
        } else if (fCommand[1] == "state") {
          switch(doubleArgs.toLowerCase()) {
            case "arizona":
            case "az":
              config.users[message.author.id].location.state = "Arizona";
              break;
            case "texas":
            case "tx":
              config.users[message.author.id].location.state = "Texas";
              break;
            case "california":
            case "ca":
              config.users[message.author.id].location.state = "California";
              break;
            case "oregon":
            case "or":
              config.users[message.author.id].location.state = "Oregon";
              break;
            case "bavaria":
            // case "az":
              config.users[message.author.id].location.state = "Bavaria";
              break;
            case "nj":
            case "new jersey":
              config.users[message.author.id].location.state = "New Jersey";
              break;
            case "nh":
            case "new hampshire":
              config.users[message.author.id].location.state = "New Hampshire";
              break;
            case "vasdo":
            case "vasdø":
              config.users[message.author.id].location.state = "Vasdø";
              break;
            case "queensland":
              config.users[message.author.id].location.state = "Queensland";
              break;
            default:
              return message.channel.send("Please enter a valid state.")
          }
          config.users[message.author.id].location.city = null;
          config.users[message.author.id].location.continent = locations.states[config.users[message.author.id].location.state].continent
          config.users[message.author.id].location.country = locations.states[config.users[message.author.id].location.state].country
          return message.channel.send("Okay, I'm setting your state to **" + config.users[message.author.id].location.state + "**.")
        } else if (fCommand[1] == "city") {
          switch(doubleArgs.toLowerCase()) {
            case "phoenix":
            case "px":
              config.users[message.author.id].location.city = "Phoenix"
              break;
            case "glendale":
              config.users[message.author.id].location.city = "Glendale"
              break;
            case "surprise":
              config.users[message.author.id].location.city = "Surprise"
              break;
            case "munich":
              config.users[message.author.id].location.city = "Munich";
              break;
            case "los angeles":
            case "la":
              config.users[message.author.id].location.city = "Los Angeles"
              break;
            case "ontario":
              config.users[message.author.id].location.city = "Ontario"
              break;
            default:
              return message.channel.send("Please enter a valid city.")
          }
          config.users[message.author.id].location.continent = locations.cities[config.users[message.author.id].location.city].continent
          config.users[message.author.id].location.country = locations.cities[config.users[message.author.id].location.city].country
          config.users[message.author.id].location.state = locations.cities[config.users[message.author.id].location.city].state
          return message.channel.send("Okay, I'm setting your city to **" + config.users[message.author.id].location.city + "**.")
        } else if(fCommand[1] == "province") {
          switch(doubleArgs.toLowerCase()) {
            case "banten":
              config.users[message.author.id].location.state = "Banten"
              break;
            default:
              return message.channel.send("Please enter a valid province.")
          }
          config.users[message.author.id].location.city = null;
          config.users[message.author.id].location.continent = locations.states[config.users[message.author.id].location.state].continent
          config.users[message.author.id].location.country = locations.states[config.users[message.author.id].location.state].country
          return message.channel.send("Okay, I'm setting your province to **" + config.users[message.author.id].location.state + "**.")
        }
        let locationHelp = new MessageEmbed()
        .setTitle("Precipitation " + version + " Locations")
        .setDescription('Just use ' + prefix + 'location continent [location] to set!')
        .addFields(
          { name: "Continents", value: "North America\nSouth America\nEurope\nAfrica\nAsia\nOceania\nAntarctica", inline: true },
          { name: "Countries", value: "United States\nAustralia\nNorway\nGermany\nCanada\nColombia\nPhilippines", inline: true },
          { name: "States", value: "Arizona\nTexas\nCalifornia\nOregon\nBavaria", inline: true },
          { name: "Cities", value: "Phoenix\nGlendale\nSurprise\nMunich\nLos Angeles\nOntario", inline: true },
          { name: "Provinces", value: "Banten"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [locationHelp]})

      // find command
      case "find":
        if(!args) return message.channel.send("Please input a parameter.")
        let findList = new MessageEmbed()
        .setTitle("Precipitation " + version + " Query")
        .addFields(
          { name: "Results", value: find(args.toLowerCase(), "list", 10, "list")}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version  + find(args.toLowerCase(), "list", 10, "amount")});
        return message.channel.send({embeds: [findList]})

      // uinfo command
      case "uinfo":
        let uinfoUser;
        if(!args) uinfoUser = message.author;
        if(args) uinfoUser = find(args.toLowerCase(), "first", null, "list")
        if(uinfoUser == null) return message.channel.send("Please type a valid user.")
        initUser(uinfoUser)
        let userBirthday;
        if(config.users[uinfoUser.id].birthday.month == undefined) {
          userBirthday = "*not set*"
        } else {
            userBirthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
        }
        let userLocation;
        if(config.users[uinfoUser.id].location.continent == undefined) {
          userLocation = "*not set*";
        } else {
          userLocation = getLocationFormat(uinfoUser)
        }
        let uinfoMember;
        message.guild.members.cache.each(member => {
          if(uinfoUser.id == member.id) {
            return uinfoMember = member;
          }
        })
        let joinedAt;
        let nickname;
        if (!uinfoMember) {
          joinedAt = "*not in server*"
          nickname = "*not in server*"
        } else {
          joinedAt = uinfoMember.joinedAt;
          if(uinfoMember.nickname) {
            nickname = uinfoMember.nickname;
          } else {
            nickname = "*not set*"
          }
        }
        let uinfo = new MessageEmbed()
        .setTitle("User Information || " + uinfoUser.tag)
        .addFields(
          { name: "Account Dates", value: "**Creation Date**: " + uinfoUser.createdAt + "\n**Join Date**: " + joinedAt, inline: true },
          { name: "Names", value: "**Username**: " + uinfoUser.username + "\n**Nickname**: " + nickname },
          { name: "Bot Info", value: "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + userBirthday + "\n**Location**: " + userLocation }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [uinfo]})

      // uptime command
      case "uptime":
        var time;
        var uptime = parseInt(client.uptime);
        uptime = Math.floor(uptime / 1000);
        var minutes = Math.floor(uptime / 60);
        var seconds = Math.floor(uptime);
        var hours = 0;
        var days = 0;
        while (seconds >= 60) {
            seconds = seconds - 60;
        }
        while (minutes >= 60) {
            hours++;
            minutes = minutes - 60;
        }
        while (hours >= 24) {
          days++;
          hours = hours - 24;
        }
        if (minutes < 10) {
            time = hours + ":0" + minutes + ":0"
        } else {
            time = hours + ":" + minutes
        }
        return message.channel.send("Precipitation has been online for " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds.");

      case "rm":
      case "purge":
        if(parseInt(args) == 0) return message.channel.send("Okay, I didn't delete any messages.")
        if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send("You don't have the proper permissions to perform this action.")
        if(isNaN(parseInt(args))) return message.channel.send("Please input a number.")
        if(parseInt(args) > 99) return message.channel.send("Please select an amount between 1-99.")
        if(parseInt(args) == 1) {
          return message.channel.bulkDelete(parseInt(2)).then(() => {
            message.channel.send("Okay, I've deleted the above message. (really?)")
          })
        }
        return message.channel.bulkDelete(parseInt(args) + 1).then(() => {
          message.channel.send("Okay, I've deleted " + args + " messages.")
        })

      default:
        message.channel.send("Sorry, but it appears this command is unknown.");
    }
  }
})

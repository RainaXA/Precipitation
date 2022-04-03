const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require('fs');
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var prefix = "pr:" // pr; in the official Precipitation, modified for source
var version = "v0.1.9"
var verText = "just for you"

var debugging = 0;

var commands = {
  "ping": {
    "name": "ping",
    "description": "Gets the current latency of the bot.",
    "syntax": "[--no-name / --client-ping]"
  },
  "help": {
    "name": "help",
    "description": "Gets a list of commands, or shows information about a command.",
    "syntax": "(command)"
  },
  "version": {
    "name": "version",
    "description": "Shows the current bot version (of the prefix used.)",
    "syntax": "[--no-ver-text]"
  },
  "ver": {
    "name": "version",
    "description": "Shows the current bot version (of the prefix used.)",
    "syntax": "[--no-ver-text]"
  },
  "about": {
    "name": "about",
    "description": "Gives information and credits, as well as the current version support for the bot.",
    "syntax" : ""
  },
  "name": {
    "name": "name",
    "description": "Sets the name for the bot to refer to you as.",
    "syntax": "(name)"
  },
  "gender": {
    "name": "gender",
    "description": "Sets the gender for the bot to refer to you as.",
    "syntax": "(**male / female** / other)"
  },
  "birthday": {
    "name": "birthday",
    "description": "Sets your birthday.",
    "syntax": "**(mm/dd/yyyy)**"
  },
  "location": {
    "name": "location",
    "description": "Sets your current location.",
    "syntax": "**(continent / country / state / city)** **(value)**"
  },
  "placevalue": {
    "name": "placevalue",
    "description": "Temporary alpha command to see that the placevalue function works as intended.",
    "syntax": "**(number)**"
  },
  "find": {
    "name": "find",
    "description": "Find a user.",
    "syntax": "**(user)**"
  },
  "uinfo": {
    "name": "uinfo",
    "description": "Get information on a particular user.",
    "syntax": "(user)"
  },
  "uptime": {
    "name": "uptime",
    "description": "See how long Precipitation has been online.",
    "syntax": ""
  }
}

function getTextInput(text) {
  var slurs = ["nigger", "nigga", "retard", "fag", "faggot"]
  for(let i = 0; i < slurs.length; i++) {
    if(text.toLowerCase().includes(slurs[i])) return true;
  }
  return false;
}

client.login('[token]')

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
    if (!err) log("Saved settings.", "debug", 3)
    if (err) log("Settings couldn't be saved!", "error", 3)
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

  // will be redone!! ^^^
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
  // change of heart!
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
  log('Precipitation has started!', "success", 1)
  client.user.setActivity(version + " || " + prefix + "help")
  setTimeout(saveConfiguration, 5000)
  processConsoleCommand();
})

if(!fs.existsSync('./config.json')) {
  log('config.json does not exist. Creating now.', "warn", 0)
  var config = {
    "guilds": {

    },
    "users": {

    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
    log('config.json has been created.', "success", 0, null)
  })
} else {
  var config = JSON.parse(fs.readFileSync("./config.json"));
}

client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    initUser(message.author)
    var command = message.content.slice(prefix.length)
    var parameters = command.split("--")
    switch (command.toLowerCase()) {
      // old handler downfall, if there is a parameter, it has to be if/else. thank god v0.2 exists..
      case "help": // standalone help
        let helpEmbed = new MessageEmbed()
        .setTitle("Precipitation Index")
        .setDescription('List of all commands -- use `' + prefix + '` before all commands!')
        .addFields(
          { name: "General", value: "ping\nhelp\nversion\nabout", inline: true },
          { name: "Personalization", value: "name\ngender\nbirthday\nlocation (list)", inline: true },
          { name: "Alpha", value: "gtest\nbtest\nltest\nplacevalue", inline: true }
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
          { name: "Version Support", value: "**Previous Stable**: given some updates from newer version"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [aboutEmbed]})
        break;
      case "name":
        config.users[message.author.id].name = null;
        message.channel.send("Sure, I will refer to you by your username.")
        break;
      case "location":
        let locationHelp = new MessageEmbed()
        .setTitle("Precipitation " + version + " Locations")
        .setDescription('Just use ' + prefix + 'location continent [location] to set!')
        .addFields(
          { name: "Continents", value: "North America\nSouth America\nEurope\nAfrica\nAsia\nOceania\nAntarctica", inline: true },
          { name: "Countries", value: prefix + "location country [country name]. If you do not live in the US, you can use west or east to denote Western or Eastern." }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [locationHelp]})
      break;
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
      case "uinfo":
        console.log("bruh")
        let userBirthday = "*not set*"
        if(config.users[message.author.id].birthday.month != undefined) {
          userBirthday = toProperUSFormat(config.users[message.author.id].birthday.month, config.users[message.author.id].birthday.day, config.users[message.author.id].birthday.year)
        }
        let userLocation = "*not set*";
        if(config.users[message.author.id].location.continent != undefined) {
          userLocation = getLocationFormat(message.author)
        }
        let nickname = "*not set*";
        if(message.member.nickname) {
          nickname = message.member.nickname;
        }
        let uinfo = new MessageEmbed()
        .setTitle("User Information || " + message.author.tag)
        .addFields(
          { name: "Account Dates", value: "**Creation Date**: " + message.author.createdAt + "\n**Join Date**: " + message.member.joinedAt, inline: true },
          { name: "Names", value: "**Username**: " + message.author.username + "\n**Nickname**: " + nickname },
          { name: "Bot Info", value: "**Name**: " + name(message.author) + "\n**Gender**: " + gender(message.author, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + userBirthday + "\n**Location**: " + userLocation }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [uinfo]})
    }
    if(command.toLowerCase().startsWith("ver") || command.toLowerCase().startsWith("version")) {
      if(parameters[1] == "no-ver-text") {
        message.channel.send("Precipitation " + version)
      } else {
        message.channel.send("Precipitation " + version + ": " + verText + ".");
      }
    } else if(command.toLowerCase().startsWith("name ")) {
      let cmd = command.slice(5);
      if(cmd.length >= 75) {
        message.channel.send("Your name isn't that long.")
      } else if((cmd.includes("<@") && cmd.includes(">")) || cmd.includes("@everyone") || cmd.includes("@here")) {
        message.channel.send("Nice try.")
      } else if(getTextInput(cmd) == true) {
        message.channel.send("Hey, I'm not going to yell out offensive words.")
      } else {
      config.users[message.author.id].name = cmd;
      message.channel.send("Sure, I'll refer to you by \"" + name(message.author) + "\".")
    }
    } else if(command.startsWith("gender ")) {
      let cmd = command.slice(7).toLowerCase();
      let gender;
      switch(cmd) {
        case "female":
        case "she/her":
        case "f":
          gender = "female";
          break;
        case "male":
        case "he/him":
        case "m":
          gender = "male";
          break;
        case "other":
        case "they/them":
        case "o":
          gender = "other";
          break;
        default:
          gender = "n/a"
      }
      if (gender == "n/a") {
        message.channel.send("I'll just set your gender to **other**. If you'd rather not be, please use \"female\" or \"male.\"")
      } else {
        message.channel.send("Sure thing, I'll refer to you as **" + gender + "**.")
      }
      if (gender == "n/a") gender = "other";
      config.users[message.author.id].gender = gender;
    } else if (command.startsWith("birthday")) {
      let cmd = command.slice(9).split("/");
      let year = new Date().getFullYear();
      let list = "Please:\n";
      if(!cmd[0] || !cmd[1] || !cmd[2]) {
        if(!cmd[0]) {
          list = list + "- input an argument"
        } else {
          list = list + "- separate your birthday with slashes\n"
        }
      } else {
        if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2]))) {
          list = list + "- only include numbers\n"
        }
        if(cmd.length != 3) {
          list = list + "- only have three numbers separated by slashes\n"
        }
        if(cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-")) {
          list = list + "- remove the negative sign\n"
        }
        if(cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".")) {
          list = list + "- remove the decimal\n"
        }
        if(getDaysInMonth(parseInt(cmd[0]), cmd[2]) == "invalid month") {
          list = list + "- give a valid month between 1-12\n"
        }
        if(getDaysInMonth(parseInt(cmd[0]), parseInt(cmd[2])) < parseInt(cmd[1])) {
          list = list + "- make sure the month hasn't already ended\n"
        }
        if(parseInt(cmd[2]) > year || parseInt(cmd[2]) < 1903) {
          list = list + "- ensure you input the correct birthday\n"
        }
      }
      if(list == "Please:\n") {
        message.channel.send("Okay, I will set your birthday as " + toProperUSFormat(parseInt(cmd[0]), parseInt(cmd[1]), parseInt(cmd[2])) + ".")
        config.users[message.author.id].birthday.month = parseInt(cmd[0]);
        config.users[message.author.id].birthday.day = parseInt(cmd[1]);
        config.users[message.author.id].birthday.year = parseInt(cmd[2]);
      } else {
        message.channel.send(list)
      }
    } else if (command.startsWith("placevalue ")) {
      let cmd = command.slice(11)
      if(isNaN(parseInt(cmd))) return message.channel.send("Please input a number.")
      if(cmd.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
      message.channel.send(placeValue(cmd))
    } else if (command.startsWith("location ")) {
      let cmd = command.slice(9).toLowerCase();
      if (cmd == "list") {
        let locationList = new MessageEmbed()
        .setTitle("Precipitation " + version + " Locations")
        .setDescription('Just use ' + prefix + 'location continent [location] to set!')
        .addFields(
          { name: "Continents", value: "North America\nSouth America\nEurope\nAfrica\nAsia\nOceania\nAntarctica", inline: true },
          { name: "Countries", value: prefix + "location country [country name]. If you do not live in the US, you can use west or east to denote Western or Eastern." }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [locationList]})
      }
      if (cmd == "continent") {
        message.channel.send("Please re-run the command with your continent afterwards.")
      } else if (cmd.startsWith("continent ")) {
        let continent;
        cmd = cmd.slice(10)
        switch(cmd) {
          case "north america":
          case "na":
            message.channel.send("Okay, I'm setting your continent to **North America**.")
            continent = "North America";
            break;
          case "south america":
          case "sa":
            message.channel.send("Okay, I'm setting your continent to **South America**.")
            continent = "South America";
            break;
          case "europe":
          case "eu":
            message.channel.send("Okay, I'm setting your continent to **Europe**.")
            continent = "Europe";
            break;
          case "africa":
            message.channel.send("Okay, I'm setting your continent to **Africa**.")
            continent = "Africa";
            break;
          case "asia":
            message.channel.send("Okay, I'm setting your continent to **Asia**.")
            continent = "Asia";
            break;
          case "oceania":
          case "australia":
            message.channel.send("Okay, I'm setting your continent to **Oceania**.")
            continent = "Oceania";
            break;
          case "antarctica":
            message.channel.send("Okay, I'm setting your continent to **Antarctica**.")
            continent = "Antarctica";
            break;
          default:
            continent = "n/a"
        }
        if(continent != "n/a") {
          config.users[message.author.id].location.country = null;
          config.users[message.author.id].location.continent = continent;
        } else {
          message.channel.send("Please enter a valid continent.")
        }
      } else if (cmd.startsWith("country ")) {
        cmd = cmd.slice(8)
        switch (cmd) {
          case "us":
          case "united states":
          case "america":
          case "united states of america":
            config.users[message.author.id].location.continent = "North America";
            config.users[message.author.id].location.country = "United States";
            message.channel.send("Okay, I'm setting your country to **United States**.")
            break;
          case "west":
            if(config.users[message.author.id].location.continent) {
              config.users[message.author.id].location.country = "Western";
              message.channel.send("Okay, I've set it so you are from **Western " + config.users[message.author.id].location.continent + "**.")
            } else {
              message.channel.send("Please set your continent first.")
            }
            break;
          case "east":
            if(config.users[message.author.id].location.continent) {
              config.users[message.author.id].location.country = "Eastern";
              message.channel.send("Okay, I've set it so you are from **Eastern " + config.users[message.author.id].location.continent + "**.")
            } else {
              message.channel.send("Please set your continent first.")
            }
            break;
          case "australia":
          case "au":
            config.users[message.author.id].location.country = "Australia";
            config.users[message.author.id].location.continent = "Oceania";
            message.channel.send("Okay, I'm setting your country to **Australia**.")
            break;
          case "germany":
          case "german":
            config.users[message.author.id].location.country = "Germany";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Germany**.")
            break;
          case "norway":
            config.users[message.author.id].location.country = "Norway";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Norway**.")
            break;
          case "canada":
            config.users[message.author.id].location.country = "Canada";
            config.users[message.author.id].location.continent = "North America";
            message.channel.send("Okay, I'm setting your country to **Canada**.")
            break;
          case "colombia":
            config.users[message.author.id].location.country = "Colombia";
            config.users[message.author.id].location.continent = "South America";
            message.channel.send("Okay, I'm setting your country to **Colombia**.")
            break;
          case "philippines":
            config.users[message.author.id].location.country = "Philippines";
            config.users[message.author.id].location.continent = "Asia";
            message.channel.send("Okay, I'm setting your country to **Philippines**.")
            break;
          case "indonesia":
            config.users[message.author.id].location.country = "Indonesia";
            config.users[message.author.id].location.continent = "Asia";
            message.channel.send("Okay, I'm setting your country to **Indonesia**.")
            break;
          case "united kingdom":
          case "uk":
          case "britain":
          case "britian":
          case "gb":
          case "great britain":
            config.users[message.author.id].location.country = "United Kingdom";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **United Kingdom**.")
            break;
          case "sweden":
            config.users[message.author.id].location.country = "Sweden";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Sweden**.")
            break;
          case "mexico":
            config.users[message.author.id].location.country = "Mexico";
            config.users[message.author.id].location.continent = "North America";
            message.channel.send("Okay, I'm setting your country to **Mexico**.")
            break;
          case "argentina":
            config.users[message.author.id].location.country = "Argentina";
            config.users[message.author.id].location.continent = "South America";
            message.channel.send("Okay, I'm setting your country to **Argentina**.")
            break;
        }
      /*} else if (cmd.startsWith("state ")) {
        cmd = cmd.slice(6)
        switch (cmd) {
          case "us":
          case "united states":
          case "america":
          case "united states of america":
            config.users[message.author.id].location.continent = "North America";
            config.users[message.author.id].location.country = "United States";
            message.channel.send("Okay, I'm setting your country to **United States**.")
            break;
          case "west":
            if(config.users[message.author.id].location.continent) {
              config.users[message.author.id].location.country = "Western";
              message.channel.send("Okay, I've set it so you are from **Western " + config.users[message.author.id].location.continent + "**.")
            } else {
              message.channel.send("Please set your continent first.")
            }
            break;
          case "east":
            if(config.users[message.author.id].location.continent) {
              config.users[message.author.id].location.country = "Eastern";
              message.channel.send("Okay, I've set it so you are from **Eastern " + config.users[message.author.id].location.continent + "**.")
            } else {
              message.channel.send("Please set your continent first.")
            }
            break;
          case "australia":
          case "au":
            config.users[message.author.id].location.country = "Australia";
            config.users[message.author.id].location.continent = "Oceania";
            message.channel.send("Okay, I'm setting your country to **Australia**.")
            break;
          case "germany":
          case "german":
            config.users[message.author.id].location.country = "Germany";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Germany**.")
            break;
          case "norway":
            config.users[message.author.id].location.country = "Norway";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Norway**.")
            break;
          case "canada":
            config.users[message.author.id].location.country = "Canada";
            config.users[message.author.id].location.continent = "North America";
            message.channel.send("Okay, I'm setting your country to **Canada**.")
            break;
          case "colombia":
            config.users[message.author.id].location.country = "Colombia";
            config.users[message.author.id].location.continent = "South America";
            message.channel.send("Okay, I'm setting your country to **Colombia**.")
            break;
          case "philippines":
            config.users[message.author.id].location.country = "Philippines";
            config.users[message.author.id].location.continent = "Asia";
            message.channel.send("Okay, I'm setting your country to **Philippines**.")
            break;
          case "indonesia":
            config.users[message.author.id].location.country = "Indonesia";
            config.users[message.author.id].location.continent = "Asia";
            message.channel.send("Okay, I'm setting your country to **Indonesia**.")
            break;
          case "united kingdom":
          case "uk":
          case "britain":
          case "britian":
          case "gb":
          case "great britain":
            config.users[message.author.id].location.country = "United Kingdom";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **United Kingdom**.")
            break;
          case "sweden":
            config.users[message.author.id].location.country = "Sweden";
            config.users[message.author.id].location.continent = "Europe";
            message.channel.send("Okay, I'm setting your country to **Sweden**.")
            break;
          case "mexico":
            config.users[message.author.id].location.country = "Mexico";
            config.users[message.author.id].location.continent = "North America";
            message.channel.send("Okay, I'm setting your country to **Mexico**.")
            break;
          case "argentina":
            config.users[message.author.id].location.country = "Argentina";
            config.users[message.author.id].location.continent = "South America";
            message.channel.send("Okay, I'm setting your country to **Argentina**.")
            break;
        }*/
      }
    } else if (command.startsWith("help ")) {
      let cmdHelp = command.slice(5).toLowerCase()
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
        case "uptime":
          let commandHelpEmbed = new MessageEmbed()
          .setTitle("Precipitation Index || " + prefix + cmdHelp)
          .addFields(
            { name: "Description", value: commands[cmdHelp].description},
            { name: "Syntax", value: prefix + cmdHelp + " " + commands[cmdHelp].syntax}
          )
          .setColor("BLUE")
          .setFooter({ text: 'Precipitation ' + version + " || [] denotes a parameter, () denotes an argument, bolded is REQUIRED."});
          message.channel.send({embeds: [commandHelpEmbed]})
      }
    } else if(command.startsWith('ping')) {
      let user = name(message.author)
      let startTime = Date.now();
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
      message.channel.send("<:ping_receive:502755206841237505> " + pingMessage).then(function(message) {
        switch(parameters[1]) { // I'm aware you cannot combine the two. I'm sorry, that's how it is for now.
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
    } else if (command.startsWith("find ")) {
      let args = command.slice(5)
      if(!args) return message.channel.send("Please input a parameter.")
      let findList = new MessageEmbed()
      .setTitle("Precipitation " + version + " Query")
      .addFields(
        { name: "Results", value: find(args.toLowerCase(), "list", 10, "list")}
      )
      .setColor("BLUE")
      .setFooter({ text: 'Precipitation ' + version  + find(args.toLowerCase(), "list", 10, "amount")});
      return message.channel.send({embeds: [findList]})
    } else if (command.startsWith("uinfo ")) {
      let args = command.slice(6)
      let uinfoUser = find(args.toLowerCase(), "first", null, "list")
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
    }
  }
})

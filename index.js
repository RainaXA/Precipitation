const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require('fs');
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var prefix = "pr:"
var version = "v0.2.2"
var verText = "in a flash"

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
    "name": "name", // topical
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
    "syntax": "**(continent / country)** **(continent / west / east / united states)**"
  },
  "gtest": {
    "name": "gtest",
    "description": "Temporary alpha command to see that gender works as intended.",
    "syntax": ""
  },
  "btest": {
    "name": "btest",
    "description": "Temporary alpha command to see that birthday works as intended.",
    "syntax": ""
  },
  "ltest": {
    "name": "ltest",
    "description": "Temporary alpha command to see that location works as intended.",
    "syntax": ""
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
  }
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

function gender(user, mMessage, fMessage, oMessage) { // male first, female second, others third
  if(mMessage && fMessage && oMessage) {
    if(config.users[user.id].gender == "male") return mMessage;
    if(config.users[user.id].gender == "female") return fMessage;
    if(!config.users[user.id].gender || config.users[user.id].gender == "other") return oMessage;
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
      if(user.username.toLowerCase().startsWith(query)) {
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
      if(user.username.toLowerCase().startsWith(query)) {
        if(amount < 1) {
          userReturn = user;
        }
      }
    })
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
          case 7:
            pingMessage = "I'm gonna cancel you on my twitter!"
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
          case 'gtest':
          case "btest":
          case "ltest":
          case "placevalue":
          case "find":
            let commandHelpEmbed = new MessageEmbed()
            .setTitle("Precipitation Index || " + prefix + cmdHelp)
            .addFields(
              { name: "Description", value: commands[cmdHelp].description},
              { name: "Syntax", value: prefix + cmdHelp + " " + commands[cmdHelp].syntax}
            )
            .setColor("BLUE")
            .setFooter({ text: 'Precipitation ' + version + " || [] denotes a parameter, () denotes an argument, bolded is REQUIRED."});
            return message.channel.send({embeds: [commandHelpEmbed]})
          default:
            let helpEmbed = new MessageEmbed()
            .setTitle("Precipitation Index")
            .setDescription('List of all commands -- use `' + prefix + '` before all commands!')
            .addFields(
              { name: "General", value: "ping\nhelp\nversion\nabout\nfind", inline: true },
              { name: "Personalization", value: "name\ngender\nbirthday\nlocation", inline: true },
              { name: "Alpha", value: "gtest\nbtest\nltest\nplacevalue", inline: true }
            )
            .setColor("BLUE")
            .setFooter({ text: 'Precipitation ' + version });
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
          { name: "Creator", value: "**raina#7847** - bot developer" },
          { name: "Version Support", value: "**Current Stable**: gets all updates after dev build"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [aboutEmbed]});

      // Best Waifu Command Easter Egg
      case "Waifu":
        if (args == "")return message.channel.send("Taiga Aisaka (The legal loli, of couse.)"); // Yes.

      // placevalue command
      case "placevalue":
        if(isNaN(parseInt(args))) return message.channel.send("Please input a number.")
        if(args.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
        return message.channel.send(placeValue(args))

      // name command
      case "name":
        if(args.length >= 75) return message.channel.send("Your name isn't that long.")
        if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Nice try.")
        if(args == "") {
          config.users[message.author.id].name = null;
          return message.channel.send("Sure, I'll refer to you by your username.")
        }
        config.users[message.author.id].name = args;
        return message.channel.send("Sure, I'll refer to you by \"" + name(message.author) + "\".")

      // gender command
      case "gender":
        let gender;
        switch(args) {
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
          gender = "other";
          message.channel.send("I'll just set your gender to **other**. If you'd rather not be, please use \"female\" or \"male.\"")
        } else {
          message.channel.send("Sure thing, I'll refer to you as **" + gender + "**.")
        }
        config.users[message.author.id].gender = gender;
        break;

      // gtest command
      case "gtest":
        if (config.users[message.author.id].gender == 'male') return message.channel.send("hey, you a dude to me <3");
        if (config.users[message.author.id].gender == 'female') return message.channel.send("hey, you a girl to me <3");
        if (config.users[message.author.id].gender == 'other') return message.channel.send("hey, you a real one to me <3");
        if (!config.users[message.author.id].gender) return message.channel.send("hey, you a real one to me <3");

        // this is how i did it in an earlier version... im sorry but apparently barely changing shit makes this thing not want to do what you want, THIS COULD BE JUST ONE LINE...
        // THIS LANGUAGE IS SO FUCKING STUPID. "Can't access 'gender' before initialization" HOW BOUT YOU GO INITALIZE SOME BITCHES???
        // for real, I'm getting this error from a function that's worked perfectly for ages, when I've changed practically nothing here...

        //return message.channel.send("hey, you a " + gender(message.author, "dude", "girl", "real one") + " to me <3");
        // ORIGINAL LINE THAT DIDNT WORK WHEN I CHANGED SOME SHIT ^^^^^


      // bitches easter egg i love you raelynn
      case "bitches":
        if(args == "") return message.channel.send("Sorry, but it appears this command is unknown."); // nobody has to know ;)
        return message.channel.send("how bout you go " + args + " some bitches?")

      // birthday command
      case "birthday":
        let cmd = args.split("/");
        let year = new Date().getFullYear();
        if(!message.content.includes("/")) {
          message.channel.send("Currently, you must separate your birthday with slashes, and it must be in mm/dd/yyyy format.")  // two Europeans who have used this bot said it's better to keep it in one format.
        } else if(cmd.length != 3) {
          message.channel.send("That's not how dates work. It's mm/dd/yyyy.") // two Europeans who have used this bot said it's better to keep it in one format.
        } else if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2]))) {
          message.channel.send("You have to, you know, put just numbers in a birthday.")
        } else if(cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-")) {
          message.channel.send("Please exclude the negative sign. That's not how birthdays work.")
        } else if(cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".")) {
          message.channel.send("Please take out the decimal, I don't believe birthdays work like that.")
        } else if(getDaysInMonth(parseInt(cmd[0]), cmd[2]) == "invalid month") {
          message.channel.send("Please give me a valid month. If you put a 0 at the beginning, please exclude this for now.")
        } else if(getDaysInMonth(parseInt(cmd[0]), parseInt(cmd[2])) < parseInt(cmd[1])) {
          message.channel.send("Your birthday is not past when the month ended.")
        } else if(parseInt(cmd[2]) > year) {
          message.channel.send("Nice try, time traveler.")
        } else if(parseInt(cmd[2]) < 1903) {
          message.channel.send("So you're trying to tell me you're older than the oldest alive person on Earth? I doubt that.")
        } else {
          message.channel.send("Okay, I will set your birthday as " + toProperUSFormat(parseInt(cmd[0]), parseInt(cmd[1]), cmd[2]) + ".")
          config.users[message.author.id].birthday.month = parseInt(cmd[0]);
          config.users[message.author.id].birthday.day = parseInt(cmd[1]);
          config.users[message.author.id].birthday.year = parseInt(cmd[2]);
        }
        break;

      // btest command
      case "btest":
        if(!config.users[message.author.id].birthday.month) return message.channel.send("Please set your birthday first.")
        return message.channel.send(toProperUSFormat(config.users[message.author.id].birthday.month, config.users[message.author.id].birthday.day, config.users[message.author.id].birthday.year));

      // location command
      case "location":
        if(args == "continent") return message.channel.send("Please re-run the command with your continent afterwards.")
        if(args == "country") return message.channel.send("Please re-run the command with United States, East, or West.")
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
              config.users[message.author.id].location.continent = "North America";
              config.users[message.author.id].location.country = "United States";
              config.users[message.author.id].location.state = null;
              return message.channel.send("Okay, I'm setting your country to **United States**.")
            case "west":
            case "western":
              if(!config.users[message.author.id].location.continent) return message.channel.send("Please set your continent first.")
              config.users[message.author.id].location.country = "Western";
              config.users[message.author.id].location.state = null;
              break;
            case "east":
            case "eastern":
              if(!config.users[message.author.id].location.continent) return message.channel.send("Please set your continent first.")
              config.users[message.author.id].location.country = "Eastern";
              config.users[message.author.id].location.state = null;
              break;
            case "australia":
            case "au":
              config.users[message.author.id].location.continent = "Oceania";
              config.users[message.author.id].location.country = "Australia";
              config.users[message.author.id].location.state = null;
              return message.channel.send("Okay, I'm setting your country to **Australia**.")
            case "germany":
            case "german":
              config.users[message.author.id].location.continent = "Europe";
              config.users[message.author.id].location.country = "Germany";
              config.users[message.author.id].location.state = null;
              return message.channel.send("Okay, I'm setting your country to **Germany**.")
            case "norway":
              config.users[message.author.id].location.continent = "Europe";
              config.users[message.author.id].location.country = "Norway";
              config.users[message.author.id].location.state = null;
              return message.channel.send("Okay, I'm setting your country to **Norway**.")
            default:
              return message.channel.send("Please enter a valid country.")
          }
          return message.channel.send("Okay, I've set it so you are from **" + config.users[message.author.id].location.country + " " + config.users[message.author.id].location.continent + "**.")
        } else if (fCommand[1] == "state") {
          switch(doubleArgs.toLowerCase()) {
            case "arizona":
            case "az":
              config.users[message.author.id].location.continent = "North America";
              config.users[message.author.id].location.country = "United States";
              config.users[message.author.id].location.state = "Arizona";
              return message.channel.send("Okay, I'm setting your state to **Arizona**.")
            default:
              return message.channel.send("Please enter a valid state.")
          }
        }
        let locationHelp = new MessageEmbed()
        .setTitle("Precipitation " + version + " Locations")
        .setDescription('Just use ' + prefix + 'location continent [location] to set!')
        .addFields(
          { name: "Continents", value: "North America\nSouth America\nEurope\nAfrica\nAsia\nOceania\nAntarctica", inline: true },
          { name: "Countries", value: prefix + "location country [country name]. If you do not live in the US, you can use west or east to denote Western or Eastern." },
          { name: "States", value: "Arizona", inline: true }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        return message.channel.send({embeds: [locationHelp]})

      // ltest command
      case "ltest":
        if(!config.users[message.author.id].location.continent) return message.channel.send("Please set a continent first, using " + prefix + "location continent [set].");
        return message.channel.send(getLocationFormat(message.author));

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

      default:
        message.channel.send("Sorry, but it appears this command is unknown.");
    }
  }
})

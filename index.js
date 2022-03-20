const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
const colors = require('colors'); // yes, you can do this within the node.js console using the weird thingies. however, im lazy, i do this later lol, i just want to get this done quickly
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var prefix = "pr:"
var version = "v0.1.6"
var verText = "just for you"

var debugging = 0;

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

function log(message, type, level, debugUser) {
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
    if(debugUser == null) {
      if(debugging >= level) {
        return console.log(msg.bold);
      } else {
        return;
      }
    }
    if(config.users[debugUser].consent.debug == false) return;
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
  if(!config.users[au.id].consent) {
    config.users[au.id].consent = {};
    au.send("Hello! By default, Precipitation may log some messages you send that are affiliated with the bot for debugging purposes only.\nIn particular, all messages that begin with the bots prefix, and certain actions the bot is performing throughout commands.\n\nIf you do not consent, please type `pr;debugConsent` to disable this.")
    config.users[au.id].consent.debug = true;
  }
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
  // if (message.author.id == client.user.id) log(message.author.tag + " (" + message.author.id + "): " + message.content, "debug", 3, null)
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    initUser(message.author)
    if (config.users[message.author.id].consent.debug == true) log(message.author.tag + " (" + message.author.id + "): " + message.content, "debug", 3, message.author.id)
    var command = message.content.slice(prefix.length)
    var parameters = command.split("--")
    switch (command.toLowerCase()) {
      case "ping":
        let user = message.author
        let startTime = Date.now();
        let raelynnTooCute = Math.floor(Math.random() * 6)
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
        }
        message.channel.send("<:ping_receive:502755206841237505> " + pingMessage).then(function(message) {
          let endTime = Date.now() - startTime
          message.edit("<:ping_transmit:502755300017700865> (" + endTime + "ms) Hey, " + name(user) + "!");
        })
        break;
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
          { name: "Version Support", value: "**Current Stable**: gets all updates after dev build"}
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [aboutEmbed]})
        break;
      case "gtest": // this command only stays until there is a command that utilizes gender
        message.channel.send("hey, you a " + gender(message.author, "dude", "girl", "real one") + " to me <3");
        break;
      case "name":
        config.users[message.author.id].name = null;
        message.channel.send("Sure, I will refer to you by your username.")
        break;
      case "btest":
        if(!config.users[message.author.id].birthday.month) {
          message.channel.send("Please set your birthday first.")
        } else {
          message.channel.send(toProperUSFormat(config.users[message.author.id].birthday.month, config.users[message.author.id].birthday.day, config.users[message.author.id].birthday.year))
        }
        break;
      case "ltest":
        if(!config.users[message.author.id].location.continent) {
          message.channel.send("Please set a continent first, using " + prefix + "location continent [set].")
        } else {
          message.channel.send(getLocationFormat(message.author))
        }
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
      case "debugconsent":
        if(config.users[message.author.id].consent.debug == true) {
          message.channel.send("Okay, your messages will not be subject to any debug logging.")
          config.users[message.author.id].consent.debug = false;
        } else {
          message.channel.send("Okay, your messages will be subject to any debug logging.")
          config.users[message.author.id].consent.debug = true;
        }
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
  } else if (command.startsWith("birthday ")) {
    let cmd = command.slice(9).split("/");
    let year = new Date().getFullYear();
    if(!command.includes("/")) {
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
  } else if (command.startsWith("placevalue ")) {
    let cmd = command.slice(11)
    if(isNaN(parseInt(cmd))) return message.channel.send("Please input a number.")
    if(cmd.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
    message.channel.send(placeValue(cmd))
  } else if (command.startsWith("location ")) {
    log("Location command begins.", "debug", 2, message.author.id) // introduced recently (0.1.4)
    let cmd = command.slice(9).toLowerCase();
    if (cmd == "list") {
      log("Listing continents and countries.", "debug", 2, message.author.id)
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
      log("Listed.", "debug", 2, message.author.id)
    }
    if (cmd == "continent") {
      message.channel.send("Please re-run the command with your continent afterwards.")
      log("Improperly run command (pr:location continent).", "debug", 2, message.author.id)
    }
    if (cmd.startsWith("continent ")) {
      let continent;
      cmd = cmd.slice(10)
      log("Continent picked.", "debug", 2, message.author.id)
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
        log("Setting continent.", "debug", 2, message.author.id)
        config.users[message.author.id].location.country = null;
        config.users[message.author.id].location.continent = continent;
        log("Set continent.", "debug", 2, message.author.id)
      } else {
        log("Invalid continent.", "debug", 2, message.author.id)
        message.channel.send("Please enter a valid continent.")
      }
    } else if (cmd.startsWith("country ")) {
      log("Setting country.", "debug", 2, message.author.id)
      cmd = cmd.slice(8)
      switch (cmd) {
        case "us":
        case "united states":
        case "america":
        case "united states of america":
          config.users[message.author.id].location.continent = "North America";
          config.users[message.author.id].location.country = "United States";
          message.channel.send("Okay, I'm setting your country to **United States**, which also sets your continent to **North America**.")
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
      }
      log("Set country.", "debug", 2, message.author.id)
    }
  }
  }
})

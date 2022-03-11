const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

var prefix = "pr:"
var version = "v0.1.3"
var verText = "just for you"

client.login('[token]')

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) console.log("settings could not be saved!");
  })
  setTimeout(saveConfiguration, 5000);
}

function initUser(au) {
  if(!config.users[au]) {
    config.users[au] = {};
  }
  if(!config.users[au].birthday) {
    config.users[au].birthday = {};
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
  if(num.endsWith("11") || num.endsWith("12") || num.endsWith("13")) {
    return num + "th";
  } else if(num.endsWith("1")) {
    return num + "st";
  } else if(num.endsWith("2")) {
    return num + "nd";
  } else if(num.endsWith("3")) {
    return num + "rd";
  } else {
    return num + "th";
  }
}

function getMonth(month) {
  switch(month) {
    case "1":
      return "January";
    case "2":
      return "February";
    case "3":
      return "March";
    case "4":
      return "April";
    case "5":
      return "May";
    case "6":
      return "June";
    case "7":
      return "July";
    case "8":
      return "August";
    case "9":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    }
}

function getDaysInMonth(month) {
  switch(month) {
    case "1":
      return 31;
    case "2":
      return 28;
    case "3":
      return 31;
    case "4":
      return 30;
    case "5":
      return 31;
    case "6":
      return 30;
    case "7":
      return 31;
    case "8":
      return 31;
    case "9":
      return 30;
    case "10":
      return 31;
    case "11":
      return 30;
    case "12":
      return 31;
    default:
      return "invalid month"
  }
}

function toProperUSFormat(month, day, year) {
  return getMonth(month) + " " + placeValue(day) + ", " + year;
}

client.on('ready', () => {
  console.log('Precipitation has started!')
  client.user.setActivity(version + " || " + prefix + "help")
  setTimeout(saveConfiguration, 5000)
})

if(!fs.existsSync('./config.json')) {
  console.log('config.json does not exist - creating')
  var config = {
    "guilds": {

    },﻿
    "users": {

    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
    console.log('config.json has been created')
  })
} else {
  var config = JSON.parse(fs.readFileSync("./config.json"));
}

client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith(prefix) && !message.author.bot) {
    var command = message.content.slice(prefix.length)
    initUser(message.author.id)
    switch (command.toLowerCase()) {
      case "ping":
        let user = message.author
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
          { name: "Personalization", value: "name\ngender\nbirthday", inline: true },
          { name: "Alpha", value: "gtest\nbtest\nplacevalue", inline: true }
        )
        .setColor("BLUE")
        .setFooter({ text: 'Precipitation ' + version });
        message.channel.send({embeds: [helpEmbed]})
        break;
      case "ver":
      case "version":
        message.channel.send("Precipitation " + version + ": " + verText + ".");
        break;
      case "about":
        let aboutEmbed = new MessageEmbed()
        .setTitle("Precipitation " + version)
        .setDescription('Kinda cool hybrid moderation-fun bot')
        .addFields(
          { name: "Creator", value: "**raina#7847** - bot developer" }
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
    }
    if(command.toLowerCase().startsWith("name ")) {
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
      message.channel.send("Currently, you must separate your birthday with slashes, and it must be in mm/dd/yyyy format. *(don't worry, non-Americans, you'll be saved in the future.)*")
    } else if(cmd.length != 3) {
      message.channel.send("That's not how dates work. It's mm/dd/yyyy. *(don't worry, non-Americans, you'll be saved in the future.)*")
    } else if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2]))) {
      message.channel.send("You have to, you know, put just numbers in a birthday.")
    } else if(cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-")) {
      message.channel.send("Please exclude the negative sign. That's not how birthdays work.")
    } else if(cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".")) {
      message.channel.send("Please take out the decimal, I don't believe birthdays work like that either.")
    } else if(getDaysInMonth(cmd[0]) == "invalid month") {
      message.channel.send("Please give me a valid month. If you put a 0 at the beginning, please exclude this for now.")
    } else if(getDaysInMonth(cmd[0]) < parseInt(cmd[1])) {
      message.channel.send("Your birthday is not past when the month ended. *(unless you were born on a leap day! you'll be saved in the future.)*")
    } else if(parseInt(cmd[2]) > year) {
      message.channel.send("Nice try, time traveler.")
    } else if(parseInt(cmd[2]) < 1903) {
      message.channel.send("So you're trying to tell me you're older than the oldest alive person on Earth? I doubt that.")
    } else {
      message.channel.send("Okay, I will set your birthday as " + toProperUSFormat(cmd[0], cmd[1], cmd[2]) + ".")
      config.users[message.author.id].birthday.month = cmd[0];
      config.users[message.author.id].birthday.day = cmd[1];
      config.users[message.author.id].birthday.year = cmd[2];
    }
  } else if (command.startsWith("placevalue ")) {
    let cmd = command.slice(11)
    if(isNaN(parseInt(cmd))) return message.channel.send("Please input a number.")
    if(cmd.includes(".")) return message.channel.send("This will still work with the decimal, but please exclude it. I'm picky, okay?")
    message.channel.send(placeValue(cmd))
  }
  }
})

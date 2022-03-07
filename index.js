const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

var prefix = "pr:"
var version = "v0.12"
var verText = "just for you"

client.login('[token]')

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) console.log("settings could not be saved!");
  })
  setTimeout(saveConfiguration, 5000)
}

function initUser(au) {
  config.users[au] = {}
}

function name(user) {
  if(!config.users[user.id]) {
    initUser(user.id)
  }
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
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

    },
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
  if (message.content.startsWith(prefix) && !message.author.bot) {
    var command = message.content.slice(prefix.length)
    switch (command) {
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
          { name: "Personalization", value: "name\ngender", inline: true },
          { name: "Alpha", value: "gtest", inline: true }
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
        let genderedMessage;
        if(config.users[message.author.id].gender == "female") genderedMessage = "girl";
        if(config.users[message.author.id].gender == "male") genderedMessage = "dude";
        if(config.users[message.author.id].gender == "other") genderedMessage = "real one";
        message.channel.send("hey, you a " + genderedMessage + " to me <3");
    }
    if(command.startsWith("name ")) {
      let cmd = command.slice(5);
      if(cmd.length >= 75) {
        message.channel.send("Your name isn't that long.")
      } else if((cmd.includes("<@") && cmd.includes(">")) || cmd.includes("@everyone") || cmd.includes("@here")) {
        message.channel.send("Nice try.")
      } else {
      if (!config.users[message.author.id]) {
        initUser(message.author.id);
      }
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
    if(!config.users[message.author.id]) {
      initUser(message.author.id)
    }
    if (gender == "n/a") gender = "other";
    config.users[message.author.id].gender = gender;
  }
  }
})

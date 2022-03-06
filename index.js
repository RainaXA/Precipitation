const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

var prefix = "pr:"
var version = "v0.11"
var verText = "just for you"

client.login('[token]')

function saveConfiguration() {
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) console.log("settings could not be saved!");
  })
  console.log ("saved")
  setTimeout(saveConfiguration, 5000)
}

function initUser(au) {
  config.users[au] = {}
}

function name(user) {
  if(!config.users[user]) {
    initUser(user)
    console.log("lol#0")
    return client.users.fetch(user).username
  }
  if(!config.users[user].name) {
    console.log ("lol #1")
    console.log(client.users.fetch(user))
    console.log(user)
    // config.users[user].name =
    return client.users.fetch(user).username
  }
  return config.users[user].name
}

client.on('ready', () => {
  console.log('Precipitation has started!')
  client.user.setActivity("v0.11 || " + prefix + "help")
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
      let user = message.author.id
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
          { name: "General", value: "ping\nhelp\nversion\nabout" }
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
    }
    if(command.startsWith("name ")) {
      let cmd = command.slice(5);
      if(cmd.length >= 75) {
        message.channel.send("Your name isn't that long.")
      } else {
      if (!config.users[message.author.id]) {
        initUser(message.author.id);
      }
      config.users[message.author.id].name = cmd;
      message.channel.send("Sure, I'll refer to you by \"" + name(message.author.id) + "\".")
    }
  }
  }
})

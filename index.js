const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var prefix = "pr:"
var version = "v0.02"
var verText = "the robot revolution"

client.login('[token]')

client.on('ready', () => {
  console.log('Precipitation has started!')
})

client.on('messageCreate', message => {
  if (message.content.startsWith(prefix)) var command = message.content.slice(prefix.length)
  switch (command) {
    case "ping":
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
        message.edit("<:ping_transmit:502755300017700865> (" + endTime + "ms) Hello!");
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
})

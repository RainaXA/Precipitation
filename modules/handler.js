let fs = require('fs')

const { Collection, MessageEmbed } = require('discord.js');

client.commands = new Collection();
global.commands = [];

global.loadCommands = function() {
  fs.readdir("./commands", function(error, files) {
    if (error) {
      fs.mkdirSync("./commands/")
      log("commands folder not found - creating now", logging.warn, "handler")
    } else {
      let modules = files.filter(f => f.split(".").pop() === "js");
      let counter = 0;
      try {
        modules.forEach((f, i) => {
          let props = require(`../commands/${f}`);
          if(!props.name) {
            for(item in props) {
              client.commands.set(props[item].name, props[item]);
              counter++;
              if(props[item].execute.slash) commands.push(props[item].data.toJSON())
            }
          } else {
            client.commands.set(props.name, props);
            counter++;
            if(props.execute.slash) commands.push(props.data.toJSON())
          }
          log("loaded command " + props.name)
        })
      } catch (err) {
        log("Sorry, but a command had an error: " + err.stack, logging.error, "LOADER")
      }
      log("loaded " + counter + " commands.", logging.success, "handler")
    }
  })
}
loadCommands();

function processCommand(message) { // used in editing messages + normal messages
  var fCommand = message.content.slice(messagePrefix.length).split(" ")
  let counter = 0;
  while(fCommand[0] == "") {
    fCommand.shift();
    counter++;
  }
  var command = fCommand[0]
  if(command == undefined) return message.channel.send("Sorry, but it appears this command is unknown.") // crash otherwise
  var args = message.content.slice(messagePrefix.length + command.length + 1 + counter)
  var parameters = args.split("--")
  var parameter = parameters[1]
  if(!parameter) parameter = "precipitation <3" // bot breaks because "toLowerCase()" may not exist
  let cmd = client.commands.get(command.toLowerCase());
  let validCommand = false;
  try {
    if(cmd) {
      validCommand = true;
      if(!cmd.help) {
        if(message.guild) {
          for(permission of cmd.prereqs.bot) {
            if(!message.guild.me.permissions.has(permission)) return message.channel.send("I do not have permission to run this command.")
          }
          for(permission of cmd.prereqs.user) {
            if(!message.member.permissions.has(permission)) return message.channel.send("You do not have permission to run this command.")
          }
        }
        if(cmd.prereqs.owner && message.author.id != host.id["owner"]) return message.channel.send("Only the owner may use this command.")
        if(!cmd.execute.discord) return message.channel.send("This command cannot be executed as a Discord command.")
        if(!cmd.prereqs.dm && !message.guild) return message.channel.send("This command cannot be executed in a direct message.")
        return cmd.execute.discord(message, args, parameter)
      }
    }
    if(!validCommand) message.channel.send("Sorry, but it appears this command is unknown.");
  } catch(err) {
    log(err.stack, logging.error, "error")
    let errorEmbed = new MessageEmbed()
    .setTitle(":zap: EXCEPTION")
    .setDescription(String(err))
    .setColor("YELLOW")
    .setFooter({text: "Precipitation " + host.version.external })
    message.channel.send({embeds: [errorEmbed]})
  }
}

function initCommand(message) {
  if (message.content.startsWith("<@" + client.user.id + ">")) {
    global.messagePrefix = "<@" + client.user.id + ">"
  } else if (!message.guild) {
    global.messagePrefix = host.prefix
  } else {
    if(!config.guilds[message.guild.id].prefix) config.guilds[message.guild.id].prefix = host.prefix
    global.messagePrefix = config.guilds[message.guild.id].prefix
  }
  if(message.content.toLowerCase().startsWith(messagePrefix) && !message.author.bot) {
    if(!config.users[message.author.id]) config.users[message.author.id] = {}
    if(getTextInput(message.author.id, host.id["blacklisted"])) return message.channel.send("Sorry, but you are blacklisted from the bot. If you feel you've been falsely banned, please make an appeal to <@" + host.id["owner"] + ">.")
    processCommand(message);
  }
}

client.on('messageCreate', function(message) {
  initCommand(message)
});

client.on('messageUpdate', function(oldMessage, newMessage) {
  if(oldMessage.content == newMessage.content) return;
  initCommand(newMessage);
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  let command = client.commands.get(interaction.commandName);
  if (!command) return;
  if(getTextInput(interaction.user.id, host.id["blacklisted"])) return interaction.reply({ content: "Sorry, but you are blacklisted from the bot. If you feel you've been falsely banned, please make an appeal to <@" + host.id["owner"] + ">.", ephemeral: true })
  if(!command.prereqs.dm && !interaction.guild) return interaction.reply({ content: "Sorry, but this command is not permitted in a direct message.", ephemeral: true })
  if(interaction.guild) {
    for(permission of command.prereqs.bot) {
      if(!interaction.guild.me.permissions.has(permission)) return interaction.reply({ content: "I do not have permission to run this command."})
    }
    for(permission of command.prereqs.user) {
      if(!interaction.member.permissions.has(permission)) return interaction.reply({ content: "You do not have permission to run this command."})
    }
  }
  try {
    await command.execute.slash(interaction);
  } catch(err) {
    log(err.stack, logging.error, "error")
  }
  return;
});
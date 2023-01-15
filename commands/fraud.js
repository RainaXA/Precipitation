const { MessageEmbed } = require('discord.js')

function playerList(message) {
    let list = "";
    for (player of gameInfo[message.guild.id].players) {
        list = list + player.tag + "\n"
    }
    let embed = new MessageEmbed()
    .setTitle("Fraud #" + gameInfo[message.guild.id].id + " | " + message.guild.name)
    .addField("Players (" + gameInfo[message.guild.id].players.length + "/12)", list)
    .setColor(host.color)
    .setFooter({text: "Fraud v1.0"})
    message.channel.send({embeds: [embed]})
  }

try {
    var name = require('./name.js').exports.name;
} catch(err) {
    log("name function not found - defaulting to discord username only.", logging.warn, "ping")
    function name(user) {
      return user.username;
    }
}

var command = {
    name: "fraud",
    desc: "Manage Fraud games.",
    args: "**(start | join | create | list | rules | leave)**",
    parameters: "",
    execute: {
        discord: function(message, args) {
            switch(args.toLowerCase()) {
                case "create":
                  if(gameInfo[message.guild.id]) return message.channel.send("The game already exists, please **join** the game instead.")
                  gameInfo[message.guild.id] = {};
                  gameInfo[message.guild.id].players = [];
                  gameInfo[message.guild.id].players.push(message.author)
                  gameInfo[message.guild.id].id = currentID;
                  currentID++;
                  currentlyPlaying[message.author.id] = message.guild.id;
                  gameInfo[message.guild.id].started = false;
                  gameInfo[message.guild.id].fraud = null;
                  return message.channel.send("The game has been created, use `" + host.prefix + "fraud join` in this server to join!")
                case "join":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, use `" + host.prefix + "fraud create` to create it.")
                  if(gameInfo[message.guild.id].started) return message.channel.send("Sorry, but a game is ongoing in this server. You may not join a game in progress.")
                  for (player of gameInfo[message.guild.id].players) {
                      if(message.author.id == player.id) return message.channel.send("You've already joined this lobby.")
                  }
                  if(currentlyPlaying[message.author.id]) return message.channel.send("Sorry, but you're already in a game in another server. Please leave this game first.")
                  if(gameInfo[message.guild.id].players.length >= 12) return message.channel.send("Sorry, but the game is full.")
                  gameInfo[message.guild.id].players.push(message.author)
                  currentlyPlaying[message.author.id] = message.guild.id;
                  playerList(message)
                  break;
                case "start":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, please use `" + host.prefix + "fraud create` to create it.")
                  if(gameInfo[message.guild.id].players[0].id != message.author.id) return message.channel.send("You are not the host, so you may not start the game.")
                  if(gameInfo[message.guild.id].started) return message.channel.send("The game has already been started!")
                  if(gameInfo[message.guild.id].players.length < 4) return message.channel.send("A minimum of 4 players are required for the game to start.")
                  gameInfo[message.guild.id].started = true;
                  message.channel.send("Please check your DM's. The game is starting.")
                  startGame(gameInfo[message.guild.id].players, message.guild.id)
                  break;
                case "list":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, use `" + host.prefix + "fraud create` to create it.")
                  playerList(message)
                  break;
                case "rules":
                  let embed = new MessageEmbed()
                  .setTitle("Fraud's How to Play and Rules")
                  .addField("Roles", "There are two roles: Fraud and Innocent. The Fraud must impersonate somebody, and then act exactly like them. The Innocents must figure out who the Fraud is impersonating.")
                  .addField("Phases", "The Discussion Phase is simple: chat it out, figure it out, do whatever.\nDuring the Voting Phase, you may type `!vote <username>` in order to vote for someone. You don't even have to type their full name!\nDuring the Resting Phase, only the Fraud acts. The Fraud may use `!fraud <username>` (again, doesn't have to type the whole thing) to begin impersonation for the morning.")
                  .addField("Impersonation", "When you impersonate somebody, your messages will show up as theirs, and your votes will count as theirs. The other players will most likely figure out that you've impersonated somebody, but they must figure out WHO you've impersonated afterwards. Your objective is to act like the target you've chosen and avoid suspicion.")
                  .addField("Cheating", "It is against the rules to reveal to anyone outside of Fraud if you are impersonating someone else or if you are being impersonated.")
                  .addField("Spamming", "Typing multiple messages in very short intervals of time is considered spamming. It's annoying, and sometimes the entire game will slow down because of it.")
                  .setColor(host.color)
                  .setFooter({text: "Fraud v1.0"})
                  return message.channel.send({embeds: [embed]})
                case "leave":
                  if(!currentlyPlaying[message.author.id]) return message.channel.send("You are not in a game.")
                  if(gameInfo[currentlyPlaying[message.author.id]].players.length == 1) {
                    message.channel.send("The game has now been disbanded.")
                    gameInfo[currentlyPlaying[message.author.id]] = null;
                    currentlyPlaying[message.author.id] = null;
                  } else {
                    for(let i = 0; i < gameInfo[currentlyPlaying[message.author.id]].players.length; i++) {
                      if((gameInfo[currentlyPlaying[message.author.id]].players[i].id == message.author.id)) {
                        if(i != 0) {
                          gameInfo[currentlyPlaying[message.author.id]].players.splice(i, 1)
                        } else {
                          gameInfo[currentlyPlaying[message.author.id]].players.shift();
                        }
                      }
                    }
                    currentlyPlaying[message.author.id] = null;
                    message.channel.send("You have left the game.")
                  }
                  break;
              }
        }
    },
    ver: "3.0.0",
    cat: "Fun",
    prereqs: {
        dm: false,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
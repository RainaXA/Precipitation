/* ========================================================================= *\
    Deduction: Precipitation command to create and join lobbies for Deduction games
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

const { MessageEmbed, Collection } = require('discord.js')
const fs = require('fs')
const roles = require('../data/tm.json');

let fraudVer = "3.0 Beta"

client.gameModes = new Collection();

global.gameInfo = {};
global.currentlyPlaying = {}; // false if not playing, guildID if theyre in a game [stop long search for guild ID]
global.publicLobbies = [];
global.currentID = 0;

global.sendMessage = function(content, list) {
  for(player of list) {
      player.send(content)
  }
}

global.lists = {
  "1": [roles.properties.city["detective"]],
  "2": [roles.properties.city["detective"], roles.properties.city["doctor"]],
  "3": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Any"],
  "4": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Any", roles.properties.spies["hitman"]],
  "5": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Investigative", "City | Supportive", roles.properties.spies["hitman"]],
  "6": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Investigative", "City | Supportive", roles.properties.spies["hitman"], "Neutral *(excluding Serial Killer)*"],
  "7": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Investigative", "City | Supportive", "City | Any", roles.properties.spies["hitman"], "Neutral *(excluding Serial Killer)*"],
  "8": [roles.properties.city["detective"], roles.properties.city["doctor"], "City | Investigative", "City | Supportive", "City | Any", roles.properties.spies["hitman"], roles.properties.spies["framer"], "Neutral *(excluding Serial Killer)*"],
}

global.interpretList = function(list) {
  let newList = "";
  for(item of list) {
    if(item === Object(item)) {
      newList = newList + item.name + "\n"
    } else {
      newList = newList + item + "\n"
    }
  }
  return newList;
}

global.playerList = function (message) {
  let list = "";
  let specList = "";
  for (player of gameInfo[currentlyPlaying[message.author.id].id].players) {
    list = list + player.tag + "\n"
  }
  for(spec of gameInfo[currentlyPlaying[message.author.id].id].specs) {
    specList = specList + spec.tag + "\n"
  }
  if(specList == "") specList = "*None.*"
  let embed = new MessageEmbed()
  .setTitle("Lobby #" + gameInfo[currentlyPlaying[message.author.id].id].id + " [" + gameInfo[currentlyPlaying[message.author.id].id].mode + "] | " + gameInfo[currentlyPlaying[message.author.id].id].name)
  .addField("Players (" + gameInfo[currentlyPlaying[message.author.id].id].players.length + "/12)", list, true)
  if(gameInfo[currentlyPlaying[message.author.id].id].mode == "Base") embed.addField("Role List", interpretList(lists[String(gameInfo[currentlyPlaying[message.author.id].id].players.length)]), true)
  embed.addField ("Spectators", specList)
  embed.setColor(host.color)
  embed.setFooter({text: "Deduction v" + fraudVer})
  if(!currentlyPlaying[message.author.id].public) return message.channel.send({embeds: [embed]});
  return message.author.send({embeds: [embed]});
}

function createPublicLobby(message) {
  publicLobbies.push(currentID)
  gameInfo[currentID] = {
    players: [],
    viewers: [],
    specs: [],
    list: {

    },
    fraud: null,
    started: false,
    mode: "Classic",
    name: "Public",
    votes: [],
    id: currentID
  };
  gameInfo[currentID].list[message.author.id] = {
    name: message.author.username,
    id: message.author.id,
    player: true,
    tag: message.author.tag,
    dead: false,
    votedFor: null
  };
  gameInfo[currentID].players.push(gameInfo[currentID].list[message.author.id])
  gameInfo[currentID].viewers.push(message.author)
  currentlyPlaying[message.author.id] = {
    id: currentID,
    public: true
  };
  currentID++;
}

fs.readdir("./modules/deduction", function(error, files) {
  if (error) {
    fs.mkdirSync("./modules/deduction/")
    log("deduction gamemodes folder not found - creating now.", logging.warn, "deduction")
  } else {
    let modules = files.filter(f => f.split(".").pop() === "js");
    let counter = 0;
    try {
      modules.forEach((f, i) => {
        let props = require(`../modules/deduction/${f}`);
        client.gameModes.set(props.help.typename, props)
        counter++;
      })
    } catch (err) {
      log("Sorry, but a module had an error: " + err.stack, logging.error, 3)
    }
    log("loaded " + counter + " deduction modes.", logging.success, "deduction")
  }
})

var command = {
    name: "deduction",
    alias: ["sd", "deduct"],
    desc: "Manage Deduction games.",
    args: {
      "action": {
        "desc": "What action to do inside the lobby\n`start` - starts the game if you are the host\n`join` - joins the lobby in the server\n`create, list, rules, leave, disband, settings, public`",
        "required": true
      },
      "type": {
        "desc": "An additional argument to an action\n`create` - what mode to create as\n`join` - specify player or spectator\n`settings` - what setting to change (using a third argument, what to change it to)",
        "required": false
      }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
          let multiargs = args.split(" ")
            switch(multiargs[0].toLowerCase()) {
                case "create":
                  let setMode;
                  let listedGame;
                  if(multiargs[1]) {
                    let mode = client.gameModes.get(multiargs[1].toLowerCase());
                    if(mode) {
                      setMode = mode.help.name
                      listedGame = mode.help.game
                    }
                  } else {
                    setMode = "Classic";
                    listedGame = "Fraud";
                  }
                  if(gameInfo[message.guild.id]) return message.channel.send("The game already exists, please **join** the game instead.")
                  gameInfo[message.guild.id] = {
                    players: [],
                    viewers: [],
                    specs: [],
                    list: {

                    },
                    fraud: null,
                    started: false,
                    mode: setMode,
                    name: message.guild.name,
                    id: currentID
                  };
                  currentID++;
                  gameInfo[message.guild.id].list[message.author.id] = {
                    name: message.author.username,
                    id: message.author.id,
                    player: true,
                    tag: message.author.tag,
                    dead: false,
                    votedFor: null
                  };
                  gameInfo[message.guild.id].players.push(gameInfo[message.guild.id].list[message.author.id])
                  gameInfo[message.guild.id].viewers.push(message.author)
                  currentlyPlaying[message.author.id] = {
                    id: message.guild.id,
                    public: false
                  };
                  return message.channel.send("Created new game of mode `" + listedGame + "/" + setMode + "`. Anyone may use `" + host.prefix + "deduction join` in this server to join!")
                case "join":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, use `" + host.prefix + "deduction create` to create it.")
                  if(gameInfo[message.guild.id].started) return message.channel.send("Sorry, but a game is ongoing in this server. You may not join a game in progress.")
                  if(currentlyPlaying[message.author.id]) {
                    if(currentlyPlaying[message.author.id].id == message.guild.id) {
                      return message.channel.send("You're already in this lobby.")
                    }
                    return message.channel.send("Sorry, but you're already in a game in another server. Please leave this game first.")
                  }
                  if(!multiargs[1]) multiargs[1] = "player"
                  gameInfo[message.guild.id].list[message.author.id] = {};
                  gameInfo[message.guild.id].list[message.author.id].name = message.author.username;
                  gameInfo[message.guild.id].list[message.author.id].id = message.author.id;
                  //gameInfo[message.guild.id].list[message.author.id].send = message.author.send;
                  gameInfo[message.guild.id].list[message.author.id].tag = message.author.tag;
                  gameInfo[message.guild.id].list[message.author.id].dead = false;
                  gameInfo[message.guild.id].list[message.author.id].votedFor = null;
                  switch(multiargs[1].toLowerCase()) {
                    case "player":
                      if(gameInfo[message.guild.id].players.length >= 12) return message.channel.send("Sorry, but the game is full.")
                      gameInfo[message.guild.id].list[message.author.id].player = true;
                      gameInfo[message.guild.id].players.push(gameInfo[message.guild.id].list[message.author.id])
                      gameInfo[message.guild.id].viewers.push(message.author)
                      break;
                    case "spectator":
                      gameInfo[message.guild.id].viewers.push(message.author)
                      gameInfo[message.guild.id].specs.push(gameInfo[message.guild.id].list[message.author.id])
                      gameInfo[message.guild.id].list[message.author.id].player = false;
                      break;
                  }
                  currentlyPlaying[message.author.id] = {
                    id: message.guild.id,
                    public: false
                  };
                  playerList(message)
                  break;
                case "start":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, please use `" + host.prefix + "deduction create` to create it.")
                  if(gameInfo[message.guild.id].players[0].id != message.author.id) return message.channel.send("You are not the host, so you may not start the game.")
                  if(gameInfo[message.guild.id].started) return message.channel.send("The game has already been started!")
                  let mode = client.gameModes.get(gameInfo[message.guild.id].mode.toLowerCase());
                  if(gameInfo[message.guild.id].players.length < mode.help.minPlayers) return message.channel.send("A minimum of " + mode.help.minPlayers + " players are required for the game to start.")
                  mode.startGame(gameInfo[message.guild.id].viewers, message.guild.id)
                  gameInfo[message.guild.id].started = true;
                  message.channel.send("Please check your DM's. The game is starting.")
                  break;
                case "list":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, use `" + host.prefix + "deduction create` to create it.")
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
                  .setFooter({text: "Deduction v" + fraudVer})
                  return message.channel.send({embeds: [embed]})
                case "leave":
                  if(!currentlyPlaying[message.author.id]) return message.channel.send("You are not in a game.");
                  if(gameInfo[currentlyPlaying[message.author.id].id].players.length == 1 && gameInfo[currentlyPlaying[message.author.id].id].list[message.author.id].player) {
                    if(currentlyPlaying[message.author.id].public) {
                      publicLobbies = publicLobbies.filter((element) => element != currentlyPlaying[message.author.id].id)
                      message.channel.send("You have left the game.")
                    } else {
                      message.channel.send("The game has now been disbanded.")
                    }
                    gameInfo[currentlyPlaying[message.author.id].id] = null;
                    currentlyPlaying[message.author.id] = null;
                  } else {
                    let nu = gameInfo[currentlyPlaying[message.author.id].id].players.findIndex((user) => message.author.id == user.id);
                    gameInfo[currentlyPlaying[message.author.id].id].players.splice(nu, 1)
                    nu = gameInfo[currentlyPlaying[message.author.id].id].viewers.findIndex((user) => message.author.id == user.id);
                    gameInfo[currentlyPlaying[message.author.id].id].viewers.splice(nu, 1)
                    nu = gameInfo[currentlyPlaying[message.author.id].id].specs.findIndex((user) => message.author.id == user.id);
                    gameInfo[currentlyPlaying[message.author.id].id].specs.splice(nu, 1)
                    currentlyPlaying[message.author.id] = null;
                    message.channel.send("You have left the game.")
                  }
                  break;
                case "disband":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, please use `" + host.prefix + "deduction create` to create it.")
                  if(gameInfo[message.guild.id].players[0].id != message.author.id) return message.channel.send("You are not the host, so you may not disband the lobby.")
                  if(gameInfo[message.guild.id].started) return message.channel.send("The game has been started, therefore it may not be disbanded.")
                  if(currentlyPlaying[message.author.id].public) {
                    return message.channel.send("You may not disband a public game.")
                  }
                  message.channel.send("The game has now been disbanded.")
                  for(viewer of gameInfo[message.guild.id].viewers) {
                    currentlyPlaying[viewer.id] = null;
                  }
                  gameInfo[message.guild.id] = null;
                  currentlyPlaying[message.author.id] = null;
                  return;
                case "settings":
                  if(!gameInfo[message.guild.id]) return message.channel.send("The game does not exist yet, please use `" + host.prefix + "deduction create` to create it.")
                  if(!multiargs[1]) multiargs[1] = "n/a"
                  switch(multiargs[1].toLowerCase()) {
                    case "gm":
                      if(!multiargs[2]) {
                        let gameList = {};
                        client.gameModes.each(mode => {
                          if(!gameList[mode.help.game]) {
                            gameList[mode.help.game] = mode.help.name;
                          } else {
                            gameList[mode.help.game] = gameList[mode.help.game] + "\n" + mode.help.name
                          }
                        })
                        let embed = new MessageEmbed()
                        .setTitle("Lobby #" + gameInfo[message.guild.id].id + " >> Settings >> Game Modes | " + message.guild.name)
                        .setColor(host.color)
                        .setFooter({text: "Deduction v" + fraudVer})
                        for(game in gameList) {
                          embed.addField(game, gameList[game], true)
                        }
                        return message.channel.send({embeds: [embed]})
                      } else {
                        let mode = client.gameModes.get(multiargs[2].toLowerCase());
                        if(mode) {
                          gameInfo[message.guild.id].mode = mode.help.name
                          return message.channel.send("Okay, I've changed the game mode to `" + mode.help.name + "`.")
                        } else {
                          return message.channel.send("Sorry, but this mode doesn't exist. Please use `" + host.prefix + "deduction settings gm` to see the list of game modes!")
                        }
                      }
                  }
                  let embedd = new MessageEmbed()
                  .setTitle("Lobby #" + gameInfo[message.guild.id].id + " >> Settings | " + message.guild.name)
                  .addField("Game Mode (gm)", gameInfo[message.guild.id].mode)
                  .setColor(host.color)
                  .setFooter({text: "Deduction v" + fraudVer})
                  return message.channel.send({embeds: [embedd]})
                case "public":
                  if(currentlyPlaying[message.author.id]) return message.channel.send("You are already in a game.")
                  if(publicLobbies.length == 0) { // create the public lobby
                    createPublicLobby(message)
                    playerList(message)
                    return message.channel.send("You have joined a public Classic lobby. Please refer to your DMs for lobby chat and the game.")
                  } else {
                    let search = publicLobbies.find(game => gameInfo[game].players.length < 12);
                    if(search == undefined) {
                      createPublicLobby(message);
                      return message.channel.send("You have joined a public Classic lobby. Please refer to your DMs for lobby chat and the game.");
                    }
                    gameInfo[search].list[message.author.id] = {};
                    gameInfo[search].list[message.author.id].name = message.author.username;
                    gameInfo[search].list[message.author.id].id = message.author.id;
                    gameInfo[search].list[message.author.id].tag = message.author.tag;
                    gameInfo[search].list[message.author.id].dead = false;
                    gameInfo[search].list[message.author.id].votedFor = null;
                    gameInfo[search].list[message.author.id].player = true;
                    gameInfo[search].players.push(gameInfo[search].list[message.author.id])
                    gameInfo[search].viewers.push(message.author)
                    currentlyPlaying[message.author.id] = {
                      id: search,
                      public: true
                    };
                    playerList(message)
                    return message.channel.send("You have joined a public Classic lobby. Please refer to your DMs for lobby chat and the game.")
                  }
                case "tmwiki":
                  if(!multiargs[1]) {
                    let list = {
                      city: "",
                      spies: "",
                      neutral: "",
                    };
                    for(item in roles.properties.city) {
                      if(roles.properties.city[item].name) list["city"] = list["city"] + roles.properties.city[item].name + "\n";
                    }
                    for(item in roles.properties.spies) {
                      if(roles.properties.spies[item].name) list["spies"] = list["spies"] + roles.properties.spies[item].name + "\n";
                    }
                    for(item in roles.properties.neutral) {
                      if(roles.properties.neutral[item].name) list["neutral"] = list["neutral"] + roles.properties.neutral[item].name + "\n";
                    }
                    let embedd = new MessageEmbed()
                    .setTitle("The Wikipedia for The Migration | Role List")
                    .addField("City", list["city"], true)
                    .addField("Spies", list["spies"], true)
                    .addField("Neutrals", list["neutral"], true)
                    .setColor(host.color)
                    .setFooter({text: "Deduction v" + fraudVer})
                    return message.channel.send({embeds: [embedd]})
                  } else {
                    if(roles.properties.city[multiargs[1].toLowerCase()] && multiargs[1].toLowerCase() != "goal") {
                      let embedd = new MessageEmbed()
                      .setTitle("The Wikipedia for The Migration | " + roles.properties.city[multiargs[1].toLowerCase()].name)
                      .addField("Goal", roles.properties.city.goal, true)
                      .addField("Alignment", roles.properties.city[multiargs[1].toLowerCase()].alignment, true)
                      .addField("Abilities", roles.properties.city[multiargs[1].toLowerCase()].abilities)
                      .addField("Artifacts", roles.properties.city[multiargs[1].toLowerCase()].artifacts)
                      .setColor(roles.properties.city.color)
                      .setFooter({text: "Deduction v" + fraudVer})
                      return message.channel.send({embeds: [embedd]})
                    } else if(roles.properties.spies[multiargs[1].toLowerCase()] && multiargs[1].toLowerCase() != "goal") {
                      let embedd = new MessageEmbed()
                      .setTitle("The Wikipedia for The Migration | " + roles.properties.spies[multiargs[1].toLowerCase()].name)
                      .addField("Goal", roles.properties.spies.goal, true)
                      .addField("Alignment", roles.properties.spies[multiargs[1].toLowerCase()].alignment, true)
                      .addField("Abilities", roles.properties.spies[multiargs[1].toLowerCase()].abilities)
                      .addField("Artifacts", roles.properties.spies[multiargs[1].toLowerCase()].artifacts)
                      .setColor(roles.properties.spies.color)
                      .setFooter({text: "Deduction v" + fraudVer})
                      return message.channel.send({embeds: [embedd]})
                    } else if(roles.properties.neutral[multiargs[1].toLowerCase()]) {
                      let embedd = new MessageEmbed()
                      .setTitle("The Wikipedia for The Migration | " + roles.properties.neutral[multiargs[1].toLowerCase()].name)
                      .addField("Goal", roles.properties.neutral[multiargs[1].toLowerCase()].goal, true)
                      .addField("Alignment", roles.properties.neutral[multiargs[1].toLowerCase()].alignment, true)
                      .addField("Abilities", roles.properties.neutral[multiargs[1].toLowerCase()].abilities)
                      .addField("Artifacts", roles.properties.neutral[multiargs[1].toLowerCase()].artifacts)
                      .setColor(roles.properties.neutral[multiargs[1].toLowerCase()].color)
                      .setFooter({text: "Deduction v" + fraudVer})
                      return message.channel.send({embeds: [embedd]})
                    }
                  }
              }
        }
    },
    ver: "3.2.0",
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
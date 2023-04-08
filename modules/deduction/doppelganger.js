/* ========================================================================= *\
    Fraud/Doppelganger Mania: Doppelganger Mania mode for the social deduction game based on faking your identity!
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

let fs = require('fs')
if(!fs.existsSync('./commands/deduction.js')) log("Could not find a command to start Fraud games. This module may be dysfunctional.", logging.warn, "classic")

const { MessageEmbed } = require('discord.js');

                     // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
const majorityCounts = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7]

function placeValue(num) {
  let number = parseInt(num)
  if(number.toString().endsWith("11") || number.toString().endsWith("12") || number.toString().endsWith("13")) {
    return number.toString() + "th";
  } else if(number.toString().endsWith("1")) {
    return number.toString() + "st";
  } else if(number.toString().endsWith("2")) {
    return number.toString() + "nd";
  } else if(number.toString().endsWith("3")) {
    return number.toString() + "rd";
  } else {
    return number.toString() + "th";
  }
}

function dayCycle(guID) {
  // phases:
  // 0 = discussion
  // 1 = voting
  // 2 = rest
  // 3 = justice
  // 8 = revoting
  if(gameInfo[guID].phase == 1 && gameInfo[guID].day == 0) gameInfo[guID].phase = 2; // skip voting if fraud hasnt taken over
  let phase = new MessageEmbed();
  switch(gameInfo[guID].phase) {
    case 0: // begin discussion phase
      if(gameInfo[guID].sayFraudMessage == 2) {
        phase.addField("Everyone is now the Fraud.", "You must find who the real one is!") // add on that Fraud has taken over.
        gameInfo[guID].sayFraudMessage = 1;
      }
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Discussion Phase - 2m")
      phase.setColor("GREEN")
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setDescription("Discuss with the others - figure out who the real one is!")
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      } else {
        phase.setDescription("Just talk with the others - there is nothing to worry about!")
      }
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 120000, guID)
      break;
    case 1: // begin voting phase
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 30s")
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! Just type their number!")
      phase.setColor("BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 30000, guID)
      break;
    case 2: // begin rest phase
      gameInfo[guID].guilties = [];
      gameInfo[guID].phase = 0;
      gameInfo[guID].trials = 2;
      gameInfo[guID].votesAgainst = {};
      for(player of gameInfo[guID].players) {
        gameInfo[guID].votesAgainst[player.id] = [];
        gameInfo[guID].list[player.id].votedFor = null;
      }
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Resting Phase - 20s")
      phase.setColor("YELLOW")
      phase.setDescription("Chill out - relax.")
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setFooter({ text: "There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins." })
        gameInfo[guID].daysRemaining = gameInfo[guID].daysRemaining - 1;
      } else {
        gameInfo[guID].sayFraudMessage = 2;
      }
      if(gameInfo[guID].daysRemaining == 0) return win(guID, 1)
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 20000, guID)
      gameInfo[guID].day++;
      break;
    case 8: // secondary voting
      gameInfo[guID].guilties = [];
      gameInfo[guID].phase = 2;
      gameInfo[guID].votesAgainst = {};
      for(player of gameInfo[guID].players) {
        gameInfo[guID].votesAgainst[player.id] = [];
        gameInfo[guID].list[player.id].votedFor = null;
      }
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 15s")
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! Just type their number!")
      phase.setColor("DARK_BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 15000, guID)
      break;
  }
}

function win(guID, team) {
  // 0 = innocent
  // 1 = fraud
  // 2 = innocent because of fraud timeout
  gameInfo[guID].started = false;
  switch(team) {
    case 0: // innocent
      return sendMessage("**Innocents win!**", gameInfo[guID].viewers);
    case 1: // fraud
      return sendMessage("**The Fraud wins!** The Fraud was #" + gameInfo[guID].list[gameInfo[guID].fraud.id].number + ".", gameInfo[guID].viewers);
  }
}

function transitionTrial(guID) {
  // 3 = defense
  // 4 = judgement
  // 5 = death
  switch(gameInfo[guID].phase) {
    case 3:
      gameInfo[guID].phase++;
      setTimeout(transitionTrial, 45000, guID)
      break;
    case 4:
      gameInfo[guID].phase++;
      sendMessage("**Their fate lies in our hands.** Use `!guilty` to guilty, or your vote will be automatically innocent! You may take back your guilty vote using `!innocent`!", gameInfo[guID].viewers)
      setTimeout(transitionTrial, 15000, guID)
      break;
    case 5:
      if(gameInfo[guID].guilties.length > (gameInfo[guID].players.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - gameInfo[guID].guilties.length - 1)) {
        sendMessage("**GUILTY!** #" + gameInfo[guID].trialNumber + " has been executed by a vote of " + gameInfo[guID].guilties.length + "-" + (gameInfo[guID].players.length - gameInfo[guID].guilties.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - 1) + ".", gameInfo[guID].viewers)
        if(gameInfo[guID].trial.id == gameInfo[guID].fraud.id) {
          sendMessage("#" + gameInfo[guID].trialNumber + " was the Fraud.", gameInfo[guID].viewers)
          gameInfo[guID].phase = 7;
          setTimeout(win, 5000, guID, 0)
        } else {
          gameInfo[guID].dead.push(gameInfo[guID].trial)
          gameInfo[guID].list[gameInfo[guID].trial.id].dead = true;
          gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
          sendMessage("#" + gameInfo[guID].trialNumber + " was Innocent.", gameInfo[guID].viewers)
          if(gameInfo[guID].aliveCount <= 2) {
            setTimeout(win, 5000, guID, 1)
          } else {
            gameInfo[guID].phase = 2
            setTimeout(dayCycle, 5000, guID)
          }
          return;
        }
      } else {
        if(gameInfo[guID].trials == 1) gameInfo[guID].phase = 8;
        if(gameInfo[guID].trials == 0) gameInfo[guID].phase = 2;
        setTimeout(dayCycle, 5000, guID)
        return sendMessage("**INNOCENT!** #" + gameInfo[guID].trialNumber + " has been pardoned by a vote of " + (gameInfo[guID].players.length - gameInfo[guID].guilties.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - 1) + "-" + gameInfo[guID].guilties.length + ".", gameInfo[guID].viewers)
      }
  }
}

function startGame(viewers, guildID) {
  gameInfo[guildID].fraud = gameInfo[guildID].players[Math.floor(Math.random() * gameInfo[guildID].players.length)];
  gameInfo[guildID].frauded = null;
  gameInfo[guildID].sayFraudMessage = 0;
  gameInfo[guildID].day = 0;
  gameInfo[guildID].phase = 0; 
  let numbersToAssign = [];
  for(let i = 0; i < gameInfo[guildID].players.length; i++) {
    numbersToAssign.push(i + 1);
  }
  //gameInfo[guildID].dead = gameInfo[guildID].specs;
  gameInfo[guildID].dead = []
  for (viewer of gameInfo[guildID].viewers) {
    if (!gameInfo[guildID].list[viewer.id].player) {
      gameInfo[guildID].dead.push(viewer)
      gameInfo[guildID].list[viewer.id].dead = true;
    } else {
      let number = numbersToAssign[Math.floor(Math.random() * numbersToAssign.length)]
      gameInfo[guildID].list[viewer.id].number = number;
      let nu = numbersToAssign.findIndex((num) => number == num);
      numbersToAssign.splice(nu, 1);
      gameInfo[guildID].list[viewer.id].dead = false;
    }
  }
  gameInfo[guildID].trial = null;
  switch(gameInfo[guildID].players.length) { // i'll fix this later, i just want this in there
    case 1:
    case 2:
    case 3:
      gameInfo[guildID].daysRemaining = 1;
      break;
    case 4:
      gameInfo[guildID].daysRemaining = 2;
      break;
    case 5:
      gameInfo[guildID].daysRemaining = 3;
      break;
    case 6:
      gameInfo[guildID].daysRemaining = 4;
      break;
    case 7:
      gameInfo[guildID].daysRemaining = 5;
      break;
    case 8:
      gameInfo[guildID].daysRemaining = 6;
      break;
    case 9:
      gameInfo[guildID].daysRemaining = 7;
      break;
    case 10:
      gameInfo[guildID].daysRemaining = 8;
      break;
    case 11:
      gameInfo[guildID].daysRemaining = 9;
      break;
    case 12:
      gameInfo[guildID].daysRemaining = 10;
      break;
    default:
      gameInfo[guildID].daysRemaining = 3;
      break;
  }
  gameInfo[guildID].aliveCount = gameInfo[guildID].players.length;
  gameInfo[guildID].trials = 2;
  gameInfo[guildID].votesAgainst = {};
  for(player of viewers) {
    gameInfo[guildID].votesAgainst[player.id] = [];
    if(gameInfo[guildID].fraud.id == player.id) player.send("**Fraud**\nOnce the first Resting Phase ends, everyone will appear to be you!")
    if(gameInfo[guildID].fraud.id != player.id) {
      if(getTextInput(player, gameInfo[guildID].dead, 2)) {
        player.send("**Spectator**\nEnjoy the show! If somebody else dies, you can have a conversation with them.")
      } else {
        player.send("**Innocent**\nOnce everyone appears as the Fraud, you must figure out who the real Fraud is!")
      }
    }
  }
  dayCycle(guildID)
}
module.exports.startGame = startGame;

client.on('messageCreate', function(message) {
  if(message.author.id == client.user.id) return;
  if(message.guild) return;
  if(!currentlyPlaying[message.author.id]) return;
  let currentGame = gameInfo[currentlyPlaying[message.author.id].id];
  if(currentGame.mode != "Doppelganger Mania") return;
  if(!currentGame.started) {
    let prefix = "!";
    if(message.content.startsWith(prefix)) {
      let command = message.content.slice(prefix.length)
      switch(command) {
        case "help":
          return message.channel.send("Hello! Here are a quick few commands you can run in the lobby:\n\nhelp - see the list of commands\nlist - see the player list")
        case "list":
          playerList(message)
          return;
        case "start":
          if(!currentlyPlaying[message.author.id].public) return message.channel.send("You may only vote to start the game in public lobbies.")
          if(currentGame.players.length < 4) return message.channel.send("You may not vote to start the game with under 4 players.")
          if(getTextInput(message.author.id, currentGame.votes, 2)) return message.channel.send("You've already voted to start the game early.")
          currentGame.votes.push(message.author.id)
          sendMessage("**" + message.author.username + " has voted to start the game early.** " + (majorityCounts[currentGame.players.length] - currentGame.votes.length) + " more votes to start the game.", currentGame.viewers);
          if(majorityCounts[currentGame.players.length] - currentGame.votes.length == 0) {
            startGame(gameInfo[currentlyPlaying[message.author.id].id].viewers, currentlyPlaying[message.author.id].id)
            gameInfo[currentlyPlaying[message.author.id].id].started = true;
          }
          return;
      }
    }
    sendMessage("**" + message.author.username + "**: " + message.content, currentGame.viewers);
    return;
  }
  if(currentGame.list[message.author.id].dead) return sendMessage("*" + message.author.username + ": " + message.content + "*", currentGame.dead)
  switch(currentGame.phase) {
    case 0:
      return message.channel.send("You may not type during the Resting Phase.")
    case 2:
    case 8:
      if(message.content.startsWith("!vote ")) {
        let target = parseInt(message.content.toLowerCase().slice(6))
        let submitted = false;
        for(user of currentGame.players) {
          if(currentGame.list[user.id].number == target) {
            //if(message.author.id == user.id) return; // cant vote for yourself
            for(let i = 0; i < currentGame.votesAgainst[user.id].length; i++) {
              if(currentGame.votesAgainst[user.id][i] == message.author.id) return; // dont allow votes again
            }
            if(getTextInput(user, currentGame.dead, 2) && user.id != currentGame.frauded.id) return; // don't allow votes for dead/spectators, although be mindful that frauded are dead
            if(currentGame.list[message.author.id].votedFor) {
              let n = currentGame.votesAgainst[currentGame.list[message.author.id].votedFor].findIndex((userID) => message.author.id == userID);
              currentGame.votesAgainst[currentGame.list[message.author.id].votedFor].splice(n, 1)
            }
            currentGame.votesAgainst[user.id].push(message.author.id) // submit vote
            submitted = true;
          }
          if(submitted) break;
        }
        if(!submitted) break;
        if(!currentGame.list[message.author.id].votedFor) {
          sendMessage("**" + currentGame.fraud.name + " has voted against #" + target + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
        } else {
          sendMessage("**" + currentGame.fraud.name + " has changed their vote to #" + target + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
        }
        currentGame.list[message.author.id].votedFor = user.id;
        if((majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) <= 0) {
          currentGame.phase = 3;
          currentGame.trial = user;
          currentGame.trialNumber = target;
          currentGame.trials = currentGame.trials - 1;
          sendMessage("**The majority have elected to put " + currentGame.fraud.name + " (#" + target + ") on trial.** You have forty-five seconds to provide a defense for your actions.", currentGame.viewers)
          transitionTrial(currentlyPlaying[message.author.id].id); // begin the trial!
        }
      } else {
        break;
      }
      return;
    case 4:
      if(currentGame.list[message.author.id].number != currentGame.trialNumber) return;
      break;
    case 5:
      if(message.content == "!guilty") {
        if(currentGame.list[message.author.id].number == currentGame.trialNumber) return;
        if(getTextInput(message.author.id, currentGame.guilties)) return; //they've already voted guilty!
        currentGame.guilties.push(message.author.id);
        return message.channel.send("*Your vote has been received.*")
      } else if(message.content == "!innocent" || message.content == "!cancel") {
        let nu = currentGame.guilties.findIndex((userID) => message.author.id == userID);
        currentGame.guilties.splice(nu, 1)
        message.channel.send("*Your vote has been taken back.*")
      }
      break;
  }
  if(currentGame.sayFraudMessage == 1) {
    sendMessage("**[#" + currentGame.list[message.author.id].number + "] " + currentGame.fraud.name + "**: " + message.content, currentGame.viewers)
  } else {
    sendMessage("**" + message.author.username + "**: " + message.content, currentGame.viewers)
  }
})

module.exports.help = {
  name: "Doppelganger Mania",
  typename: "doppelganger mania",
  game: "Fraud Chaos",
  minPlayers: 3
}
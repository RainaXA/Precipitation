let fs = require('fs')
if(!fs.existsSync('./commands/fraud.js')) log("Could not find a command to start Fraud games. This module may be dysfunctional.", logging.warn, 2)

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
  if(gameInfo[guID].phase == 1 && !gameInfo[guID].frauded) gameInfo[guID].phase = 2; // skip voting if fraud hasnt taken over
  if(gameInfo[guID].day >= 2 && !gameInfo[guID].frauded) return win(guID, 2) // autowin if no taken over by the end of second resting phase
  let phase = new MessageEmbed();
  switch(gameInfo[guID].phase) {
    case 0: // begin discussion phase
      if(gameInfo[guID].sayFraudMessage == 2) {
        phase.addField("The Fraud has swapped with somebody.", "You must find who have swapped with each other!") // add on that Fraud has taken over.
        gameInfo[guID].frauded.send("**You've swapped positions with the Fraud!** You must now attempt to act as " + gameInfo[guID].fraud.username + ".")
        gameInfo[guID].frauds = gameInfo[guID].frauds + 1;
        gameInfo[guID].sayFraudMessage = 1;
      }
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Discussion Phase - 2m")
      phase.setColor("GREEN")
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setDescription("Discuss with the others - figure out who's swapped, or act like each other!")
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Frauds win.")
      } else {
        phase.setDescription("Just talk with the others - there is nothing to worry about!")
      }
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 120000, guID)
      break;
    case 1: // begin voting phase
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 30s")
      phase.setDescription("Vote for who you think was swapped with `!vote`! You don't even have to type their full name!")
      phase.setColor("BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Frauds win.")
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
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Frauds win.")
        phase.setDescription("Chill out - relax.")
        gameInfo[guID].daysRemaining = gameInfo[guID].daysRemaining - 1;
      } else {
        phase.setDescription("If you're the Fraud, swap with someone using `!fraud`! You don't even have to type their full name! Otherwise, just relax.")
        phase.setFooter("Innocents automatically win if the Fraud doesn't swap after the 2nd Resting Phase.")
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
      phase.setDescription("Vote for who you think was swapped with `!vote`! You don't even have to type their full name!")
      phase.setColor("DARK_BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Frauds win.")
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
      return sendMessage("**The Frauds win!** " + gameInfo[guID].fraud.username + " was the Fraud, and they swapped with " + gameInfo[guID].frauded.username + ".", gameInfo[guID].viewers);
    case 2: // innocents due to fraud inactivity
      return sendMessage("**Innocents win!** " + gameInfo[guID].fraud.username + " was the inactive Fraud.", gameInfo[guID].viewers);
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
        sendMessage("**GUILTY!** " + gameInfo[guID].trial.name + " has been executed by a vote of " + gameInfo[guID].guilties.length + "-" + (gameInfo[guID].players.length - gameInfo[guID].guilties.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - 1) + ".", gameInfo[guID].viewers)
        if(gameInfo[guID].trial.id == gameInfo[guID].fraud.id) {
          gameInfo[guID].dead.push(gameInfo[guID].frauded)
          gameInfo[guID].list[gameInfo[guID].frauded.id].dead = true;
        } else if (gameInfo[guID].trial.id == gameInfo[guID].frauded.id) {
          gameInfo[guID].dead.push(gameInfo[guID].fraud)
          gameInfo[guID].list[gameInfo[guID].fraud.id].dead = true;
        } else {
          gameInfo[guID].dead.push(gameInfo[guID].trial)
          gameInfo[guID].list[gameInfo[guID].trial.id].dead = true;
        }
        gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
        log(gameInfo[guID].guilties, logging.output, "fraud debug")
        if(gameInfo[guID].trial.id == gameInfo[guID].frauded.id || gameInfo[guID].trial.id == gameInfo[guID].fraud.id) {
          sendMessage(gameInfo[guID].trial.name + " was a Fraud.", gameInfo[guID].viewers)
          gameInfo[guID].frauds = gameInfo[guID].frauds - 1;
          if(gameInfo[guID].frauds == 0) {
            gameInfo[guID].phase = 7;
            return setTimeout(win, 5000, guID, 0)
          } else {
            gameInfo[guID].phase = 2;
          }
        } else {
          sendMessage(gameInfo[guID].trial.name + " was Innocent.", gameInfo[guID].viewers)
          if(gameInfo[guID].aliveCount <= 2) {
            return setTimeout(win, 5000, guID, 1)
          } else {
            gameInfo[guID].phase = 2
          }
        }
        setTimeout(dayCycle, 5000, guID)
        return;
      } else {
        if(gameInfo[guID].trials == 1) gameInfo[guID].phase = 8;
        if(gameInfo[guID].trials == 0) gameInfo[guID].phase = 2;
        setTimeout(dayCycle, 5000, guID)
        return sendMessage("**INNOCENT!** " + gameInfo[guID].trial.name + " has been pardoned by a vote of " + (gameInfo[guID].players.length - gameInfo[guID].guilties.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - 1) + "-" + gameInfo[guID].guilties.length + ".", gameInfo[guID].viewers)
      }
  }
}

module.exports.startGame = function(viewers, guildID) {
  gameInfo[guildID].fraud = gameInfo[guildID].viewers[Math.floor(Math.random() * gameInfo[guildID].viewers.length)];
  while(!gameInfo[guildID].list[gameInfo[guildID].fraud.id].player) {
    gameInfo[guildID].fraud = gameInfo[guildID].viewers[Math.floor(Math.random() * gameInfo[guildID].viewers.length)];
  }
  gameInfo[guildID].frauded = null;
  gameInfo[guildID].sayFraudMessage = 0;
  gameInfo[guildID].day = 0;
  gameInfo[guildID].phase = 0;
  gameInfo[guildID].frauds = 1;
  gameInfo[guildID].guilties = [];
  console.log(gameInfo[guildID].guilties)
  //gameInfo[guildID].dead = gameInfo[guildID].specs;
  gameInfo[guildID].dead = []
  for (viewer of gameInfo[guildID].viewers) {
    if (!gameInfo[guildID].list[viewer.id].player) {
      gameInfo[guildID].dead.push(viewer)
      gameInfo[guildID].list[viewer.id].dead = true;
    } else {
      gameInfo[guildID].list[viewer.id].dead = false;
    }
  }
  gameInfo[guildID].trial = null;
  switch(gameInfo[guildID].players.length) { // i'll fix this later, i just want this in there
    case 1:
    case 2:
    case 3:
    case 4:
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
    case 10:
    case 11:
    case 12:
      gameInfo[guildID].daysRemaining = 7;
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
    if(gameInfo[guildID].fraud.id == player.id) player.send("**Fraud**\nSwap positions with somebody during the first Resting Phase, and you'll have to pretend to be each other!")
    if(gameInfo[guildID].fraud.id != player.id) {
      if(getTextInput(player, gameInfo[guildID].dead, 2)) {
        player.send("**Spectator**\nEnjoy the show! If somebody else dies, you can have a conversation with them.")
      } else {
        player.send("**Innocent**\nOnce the Fraud swaps with somebody else, you must figure out who they are!")
      }
    }
  }
  dayCycle(guildID)
}

client.on('messageCreate', function(message) {
  if(message.author.id == client.user.id) return;
  if(message.guild) return;
  if(!currentlyPlaying[message.author.id]) return;
  let currentGame = gameInfo[currentlyPlaying[message.author.id].id];
  if(currentGame.mode != "Swap!") return;
  if(!currentGame.started) return message.channel.send("The game has not been started yet.")
  if(currentGame.list[message.author.id].dead) return sendMessage("*" + message.author.username + ": " + message.content + "*", currentGame.dead)
  switch(currentGame.phase) {
    case 0:
      if(message.author.id != currentGame.fraud.id) return message.channel.send("You may not type during the Resting Phase.")
      if(message.content.startsWith("!fraud ")) {
        if(currentGame.sayFraudMessage == 1) return message.channel.send("You have already swapped, so you may not change your target.")
        let cmd = message.content.slice(7).toLowerCase()
        for(user of currentGame.viewers) {
          if(user.username.toLowerCase().includes(cmd)) {
            if(user.id == currentGame.fraud.id) return message.channel.send("You cannot swap with yourself, that would be weird.")
            if(!currentGame.list[user.id].player) return message.channel.send("You cannot swap with a spectator.")
            currentGame.frauded = user;
            switch(currentGame.sayFraudMessage) {
              case 0:
                message.channel.send("You have decided to swap with " + user.username + ".")
                break;
              case 2:
                return message.channel.send("You have instead decided to swap with " + user.username + ".")
            }
            currentGame.sayFraudMessage = 2;
          }
        }
      }
      return;
    case 2:
    case 8:
      if(message.content.startsWith("!vote ")) {
        let target = message.content.toLowerCase().slice(6)
        let submitted = false;
        for(user of currentGame.players) {
          if(user.name.toLowerCase().includes(target)) {
            if(message.author.id == user.id && message.author.id != currentGame.fraud.id && message.author.id != currentGame.frauded.id) return; // cant vote for yourself
            if(message.author.id == currentGame.fraud.id && currentGame.frauded.id == user.id) return;
            if(message.author.id == currentGame.frauded.id && currentGame.fraud.id == user.id) return;
            for(let i = 0; i < currentGame.votesAgainst[user.id].length; i++) {
              if(currentGame.votesAgainst[user.id][i] == message.author.id) return; // dont allow votes again
            }
            if(getTextInput(user, currentGame.dead, 2)) return; // don't allow votes for dead/spectators, although be mindful that frauded are dead
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
        let shownName = message.author.username;
        if(message.author.id == currentGame.fraud.id) shownName = currentGame.frauded.username
        if(message.author.id == currentGame.frauded.id) shownName = currentGame.fraud.username
        if(!currentGame.list[message.author.id].votedFor) {
          sendMessage("**" + shownName + " has voted against " + user.name + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
        } else {
          sendMessage("**" + shownName + " has changed their vote to " + user.name + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
        }
        currentGame.list[message.author.id].votedFor = user.id;
        if((majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) <= 0) {
          currentGame.phase = 3;
          currentGame.trial = user;
          currentGame.trials = currentGame.trials - 1;
          sendMessage("**The majority have elected to put " + user.name + " on trial.** You have forty-five seconds to provide a defense for your actions.", currentGame.viewers)
          transitionTrial(currentlyPlaying[message.author.id].toString()); // begin the trial!
        }
      } else {
        break;
      }
      return;
    case 4:
      if(message.author.id != currentGame.fraud.id && message.author.id != currentGame.frauded.id) { // user is not the fraud
        if(message.author.id != currentGame.trial.id) return; // since they cant take over, are they the one on trial?
      } else { // they are fraud :)
        if(currentGame.frauded.id != currentGame.trial.id && message.author.id != currentGame.frauded.id) return;
        if(currentGame.fraud.id != currentGame.trial.id && message.author.id != currentGame.fraud.id) return; // trials can only happen if fraud takes over, so we can assume frauded exists
      }
      break;
    case 5:
      if(message.content == "!guilty") {
        if(message.author.id != currentGame.fraud.id && message.author.id != currentGame.frauded.id) { // user is not the fraud
          if(message.author.id == currentGame.trial.id) return; // since they cant take over, are they the one on trial?
        } else { // they are fraud :)
          if(currentGame.frauded.id == currentGame.trial.id && message.author.id == currentGame.fraud.id) return;
          if(currentGame.fraud.id == currentGame.trial.id && message.author.id == currentGame.frauded.id) return; // trials can only happen if fraud takes over, so we can assume frauded exists
        }
        if(getTextInput(message.author.id, currentGame.guilties)) return; //they've already voted guilty!
        currentGame.guilties.push(message.author.id);
        return message.channel.send("*Your vote has been received.*")
      } else if(message.content == "!innocent" || message.content == "!cancel") {
        let nu = currentGame.guilties.findIndex((userID) => message.author.id == userID);
        currentGame.guilties.splice(nu, 1)
        return message.channel.send("*Your vote has been taken back.*")
      }
      break;
  }
  if(currentGame.frauded) {
    if(currentGame.fraud.id == message.author.id) return sendMessage("**" + currentGame.frauded.username + "**: " + message.content, currentGame.viewers)
    if(message.author.id == currentGame.frauded.id) return sendMessage("**" + currentGame.fraud.username + "**: " + message.content, currentGame.viewers)
  }
  sendMessage("**" + message.author.username + "**: " + message.content, currentGame.viewers)
})

module.exports.help = {
  name: "Swap!",
  typename: "swap!",
  minPlayers: 5
}
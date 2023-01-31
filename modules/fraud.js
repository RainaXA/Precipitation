// dependencies
// command :: config.js -- change logging channels

let fs = require('fs')
if(!fs.existsSync('./commands/fraud.js')) log("Could not find a command to start Fraud games. This module may be dysfunctional.", logging.warn, 2)

const { MessageEmbed } = require('discord.js');

global.gameInfo = {};
global.currentlyPlaying = {}; // false if not playing, guildID if theyre in a game [stop long search for guild ID]
global.currentID = 0;

global.sendMessage = function(content, list) {
    for(player of list) {
        player.send(content)
    }
}

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
        phase.addField("The Fraud has taken over someone.", "You must find who " + gameInfo[guID].fraud.username + " has taken over!") // add on that Fraud has taken over.
        gameInfo[guID].frauded.send("**You've been taken over!**")
        gameInfo[guID].dead.push(gameInfo[guID].frauded)
        gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
        gameInfo[guID].sayFraudMessage = 1;
      }
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Discussion Phase - 2m")
      phase.setColor("GREEN")
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setDescription("Discuss with the others - figure out who's been taken over, or act like your victim!")
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      } else {
        phase.setDescription("Just talk with the others - there is nothing to worry about!")
      }
      sendMessage({embeds: [phase]}, gameInfo[guID].players)
      setTimeout(dayCycle, 120000, guID)
      break;
    case 1: // begin voting phase
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 30s")
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! You don't even have to type their full name!")
      phase.setColor("BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      sendMessage({embeds: [phase]}, gameInfo[guID].players)
      setTimeout(dayCycle, 30000, guID)
      break;
    case 2: // begin rest phase
      gameInfo[guID].guilties = [];
      gameInfo[guID].phase = 0;
      gameInfo[guID].trials = 2;
      gameInfo[guID].votesAgainst = {};
      for(player of gameInfo[guID].players) {
        gameInfo[guID].votesAgainst[player.id] = [];
      }
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Resting Phase - 20s")
      phase.setColor("YELLOW")
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
        phase.setDescription("Chill out - relax.")
        gameInfo[guID].daysRemaining = gameInfo[guID].daysRemaining - 1;
      } else {
        phase.setDescription("If you're the Fraud, take over someone using `!fraud`! You don't even have to type their full name! Otherwise, just relax.")
        phase.setFooter("Innocents automatically win if the Fraud doesn't take over after the 2nd Resting Phase.")
      }
      if(gameInfo[guID].daysRemaining == 0) return win(guID, 1)
      sendMessage({embeds: [phase]}, gameInfo[guID].players)
      setTimeout(dayCycle, 20000, guID)
      gameInfo[guID].day++;
      break;
    case 8: // secondary voting
      gameInfo[guID].guilties = [];
      gameInfo[guID].phase = 2;
      gameInfo[guID].trials = 2;
      gameInfo[guID].votesAgainst = {};
      for(player of gameInfo[guID].players) {
        gameInfo[guID].votesAgainst[player.id] = [];
      }
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 15s")
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! You don't even have to type their full name!")
      phase.setColor("DARK_BLUE")
      phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
      sendMessage({embeds: [phase]}, gameInfo[guID].players)
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
      return sendMessage("**Innocents win!**", gameInfo[guID].players);
    case 1: // fraud
      return sendMessage("**The Fraud wins!** " + gameInfo[guID].fraud.username + " was the Fraud, and they took over " + gameInfo[guID].frauded.username + ".", gameInfo[guID].players);
    case 2: // innocents due to fraud inactivity
      return sendMessage("**Innocents win!** " + gameInfo[guID].fraud.username + " was the inactive Fraud.", gameInfo[guID].players);
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
      sendMessage("**Their fate lies in our hands.** Use `!guilty` to guilty, or your vote will be automatically innocent!", gameInfo[guID].players)
      setTimeout(transitionTrial, 15000, guID)
      break;
    case 5:
      setTimeout(dayCycle, 10000, guID)
      if(gameInfo[guID].guilties.length > (gameInfo[guID].players.length - gameInfo[guID].dead.length - gameInfo[guID].guilties.length)) {
        sendMessage("**GUILTY!** They have been executed.", gameInfo[guID].players)
        gameInfo[guID].dead.push(gameInfo[guID].trial)
        gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
        if(gameInfo[guID].trial.id == gameInfo[guID].frauded.id) {
          sendMessage(gameInfo[guID].trial.username + " was the Fraud.", gameInfo[guID].players)
          gameInfo[guID].phase = 7;
          setTimeout(win, 3000, guID, 0)
        } else {
          sendMessage(gameInfo[guID].trial.username + " was Innocent.", gameInfo[guID].players)
          if(gameInfo[guID].aliveCount <= 2) {
            setTimeout(win, 5000, guID, 1)
          } else {
            gameInfo[guID].phase = 2
          }
          return;
        }
      } else {
        if(gameInfo[guID].trials == 1) gameInfo[guID].phase = 8;
        if(gameInfo[guID].trials == 0) gameInfo[guID].phase = 2;
        return sendMessage("**INNOCENT!** They may now return to play.", gameInfo[guID].players)
      }
  }
}

global.startGame = function(playerList, guildID) {
  gameInfo[guildID].fraud = playerList[Math.floor(Math.random() * playerList.length)];
  gameInfo[guildID].frauded = null;
  gameInfo[guildID].sayFraudMessage = 0;
  gameInfo[guildID].day = 0;
  gameInfo[guildID].phase = 0;
  gameInfo[guildID].dead = [];
  gameInfo[guildID].trial = null;
  gameInfo[guildID].daysRemaining = 3;
  gameInfo[guildID].aliveCount = gameInfo[guildID].players.length;
  for(spec of gameInfo[guildID].specs) {
    gameInfo[guildID].dead.push(spec)
    gameInfo[guildID].aliveCount = gameInfo[guildID].aliveCount - 1
  }
  while(getTextInput(gameInfo[guildID].fraud, gameInfo[guildID].dead, 2)) {
    gameInfo[guildID].fraud = playerList[Math.floor(Math.random() * playerList.length)];
  }
  gameInfo[guildID].trials = 2;
  gameInfo[guildID].votesAgainst = {};
  for(player of playerList) {
    gameInfo[guildID].votesAgainst[player.id] = [];
    if(gameInfo[guildID].fraud.id == player.id) player.send("**Fraud**\nImpersonate somebody during the first resting period, and you have to act exactly like them without being caught.")
    if(gameInfo[guildID].fraud.id != player.id) {
      if(getTextInput(player, gameInfo[guildID].dead, 2)) {
        player.send("**Spectator**\nEnjoy the show! If somebody else dies, you can have a conversation with them.")
      } else {
        player.send("**Innocent**\nOnce the Fraud takes over somebody, you must figure out who it is!")
      }
    }
  }
  dayCycle(guildID)
}

client.on('messageCreate', function(message) {
  if(message.author.id == client.user.id) return;
  if(message.guild) return;
  if(!currentlyPlaying[message.author.id]) return;
  let currentGame = gameInfo[currentlyPlaying[message.author.id].toString()];
  if(!currentGame.started) return message.channel.send("The game has not been started yet.")
  let isDead = false;
  for(let i = 0; i < currentGame.dead.length; i++) {
    if((currentGame.dead[i].id == message.author.id)) isDead = true;
  }
  if(isDead) return sendMessage("*" + message.author.username + ": " + message.content + "*", currentGame.dead)
  switch(currentGame.phase) {
    case 0:
      if(message.author.id != currentGame.fraud.id) return message.channel.send("You may not type during the Resting Phase.")
      if(message.content.startsWith("!fraud ")) {
        if(currentGame.sayFraudMessage == 1) return message.channel.send("You have already taken over, so you may not change your target.")
        let cmd = message.content.slice(7)
        for(user of currentGame.players) {
          if(user.username.toLowerCase().includes(cmd)) {
            if(user.id == currentGame.fraud.id) return message.channel.send("You cannot take over yourself, that would be weird.")
            if(getTextInput(user, gameInfo[guildID].dead, 2)) return message.channel.send("You cannot take over a spectator.")
            currentGame.frauded = user;
            currentGame.sayFraudMessage = 2;
            return message.channel.send("You have decided to take over " + user.username + ".")
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
          if(user.username.toLowerCase().includes(target)) {
            if(message.author.id == user.id) return; // cant vote for yourself
            if(user.id == currentGame.fraud.id) return user.send("*You can't vote for the original Fraud. You must try to find the one they've taken over.*"); // cant vote for the older fraud
            for(let i = 0; i < currentGame.votesAgainst[user.id].length; i++) {
              if(currentGame.votesAgainst[user.id][i] == message.author.id) return; // dont allow votes again
            }
            if(getTextInput(user, gameInfo[guildID].dead, 2) && user.id != currentGame.frauded.id) return; // don't allow votes for dead/spectators, although be mindful that frauded are dead
            if(message.author.id == currentGame.fraud.id && currentGame.frauded) {
              currentGame.votesAgainst[user.id].push(currentGame.frauded.id) // submit vote as Frauded
            } else {
              currentGame.votesAgainst[user.id].push(message.author.id) // submit vote
            }
            submitted = true;
          }
          if(submitted) break;
        }
        if(!submitted) break;
        if(message.author.id == currentGame.fraud.id && currentGame.frauded != null) {
          sendMessage("**" + currentGame.frauded.username + " has voted against " + user.username + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.players)
        } else {
          sendMessage("**" + message.author.username + " has voted against " + user.username + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.players)
        }
        if((majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) <= 0) {
          currentGame.phase = 3;
          currentGame.trial = user;
          currentGame.trials = currentGame.trials - 1;
          sendMessage("**The majority have elected to put " + user.username + " on trial.** You have forty-five seconds to provide a defense for your actions.", currentGame.players)
          transitionTrial(currentlyPlaying[message.author.id].toString()); // begin the trial!
        }
      } else {
        break;
      }
      return;
    case 4:
      if(message.author.id != currentGame.fraud.id) { // user is not the fraud
        if(message.author.id != currentGame.trial.id) return; // since they cant take over, are they the one on trial?
      } else { // they are fraud :)
        if(currentGame.frauded.id != currentGame.trial.id) return; // trials can only happen if fraud takes over, so we can assume frauded exists
      }
      break;
    case 5:
      if(message.content == "!guilty") {
        if(message.author.id != currentGame.fraud.id) { // user is not the fraud
          if(message.author.id == currentGame.trial.id) return; // since they cant take over, are they the one on trial?
        } else { // they are fraud :)
          if(currentGame.frauded.id == currentGame.trial.id) return; // trials can only happen if fraud takes over, so we can assume frauded exists
        }
        if(getTextInput(message.author.id, currentGame.guilties)) return; //they've already voted guilty!
        currentGame.guilties.push(message.author.id);
        return message.channel.send("*Your vote has been received.*")
      }
      break;
  }
  if(currentGame.fraud.id == message.author.id && currentGame.frauded != null) return sendMessage("**" + currentGame.frauded.username + "**: " + message.content, currentGame.players)
  sendMessage("**" + message.author.username + "**: " + message.content, currentGame.players)
})

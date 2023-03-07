let fs = require('fs')
const { MessageEmbed } = require('discord.js');

const roles = require('../../data/tm.json');

                     // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
const majorityCounts = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7]

let baseList = [];

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
        phase.addField("The Fraud has taken over someone.", "You must find who " + gameInfo[guID].fraud.name + " has taken over!") // add on that Fraud has taken over.
        gameInfo[guID].frauded.send("**You've been taken over!**")
        gameInfo[guID].dead.push(gameInfo[guID].frauded)
        gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
        gameInfo[guID].list[gameInfo[guID].frauded.id].dead = true;
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
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 120000, guID)
      break;
    case 1: // begin voting phase
      gameInfo[guID].phase++;
      phase.setTitle(placeValue(gameInfo[guID].day + 1) + " Voting Phase - 30s")
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! You don't even have to type their full name!")
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
      if(gameInfo[guID].sayFraudMessage == 1) {
        phase.setFooter("There are " + gameInfo[guID].daysRemaining + " days remaining before the Fraud wins.")
        phase.setDescription("Chill out - relax.")
        gameInfo[guID].daysRemaining = gameInfo[guID].daysRemaining - 1;
      } else {
        phase.setDescription("If you're the Fraud, take over someone using `!fraud`! You don't even have to type their full name! Otherwise, just relax.")
        phase.setFooter("Innocents automatically win if the Fraud doesn't take over after the 2nd Resting Phase.")
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
      phase.setDescription("Vote for who you think was taken over by the Fraud with `!vote`! You don't even have to type their full name!")
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
      return sendMessage("**The Fraud wins!** " + gameInfo[guID].fraud.name + " was the Fraud, and they took over " + gameInfo[guID].frauded.username + ".", gameInfo[guID].viewers);
    case 2: // innocents due to fraud inactivity
      return sendMessage("**Innocents win!** " + gameInfo[guID].fraud.name + " was the inactive Fraud.", gameInfo[guID].viewers);
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
        gameInfo[guID].dead.push(gameInfo[guID].trial)
        gameInfo[guID].list[gameInfo[guID].trial.id].dead = true;
        gameInfo[guID].aliveCount = gameInfo[guID].aliveCount - 1;
        if(gameInfo[guID].trial.id == gameInfo[guID].frauded.id) {
          sendMessage(gameInfo[guID].trial.name + " was the Fraud.", gameInfo[guID].viewers)
          gameInfo[guID].phase = 7;
          setTimeout(win, 5000, guID, 0)
        } else {
          sendMessage(gameInfo[guID].trial.name + " was Innocent.", gameInfo[guID].viewers)
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
        return sendMessage("**INNOCENT!** " + gameInfo[guID].trial.name + " has been pardoned by a vote of " + (gameInfo[guID].players.length - gameInfo[guID].guilties.length - (gameInfo[guID].dead.length - gameInfo[guID].specs.length) - 1) + "-" + gameInfo[guID].guilties.length + ".", gameInfo[guID].viewers)
      }
  }
}

function startGame(viewers, guildID) {
  gameInfo[guildID].day = 0;
  gameInfo[guildID].phase = 0;
  //gameInfo[guildID].dead = gameInfo[guildID].specs;
  gameInfo[guildID].dead = [];
  for (viewer of gameInfo[guildID].viewers) {
    if (!gameInfo[guildID].list[viewer.id].player) {
      gameInfo[guildID].dead.push(viewer)
      gameInfo[guildID].list[viewer.id].dead = true;
    } else {
      gameInfo[guildID].list[viewer.id].dead = false;
    }
  }
  gameInfo[guildID].trial = null;
  gameInfo[guildID].aliveCount = gameInfo[guildID].players.length;
  gameInfo[guildID].trials = 2;
  gameInfo[guildID].votesAgainst = {};
  for(player of viewers) { // assign roles!
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
module.exports.startGame = startGame;

client.on('messageCreate', function(message) {
  if(message.author.id == client.user.id) return;
  if(message.guild) return;
  if(!currentlyPlaying[message.author.id]) return;
  let currentGame = gameInfo[currentlyPlaying[message.author.id].id];
  if(currentGame.mode != "Base") return;
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
      if(message.author.id != currentGame.fraud.id) return message.channel.send("You may not type during the Resting Phase.")
      if(message.content.startsWith("!fraud ")) {
        if(currentGame.sayFraudMessage == 1) return message.channel.send("You have already taken over, so you may not change your target.")
        let cmd = message.content.slice(7).toLowerCase()
        for(user of currentGame.viewers) {
          if(user.username.toLowerCase().includes(cmd)) {
            if(user.id == currentGame.fraud.id) return message.channel.send("You cannot take over yourself, that would be weird.")
            if(!currentGame.list[user.id].player) return message.channel.send("You cannot take over a spectator.")
            currentGame.frauded = user;
            switch(currentGame.sayFraudMessage) {
              case 0:
                message.channel.send("You have decided to take over " + user.username + ".")
                break;
              case 2:
                return message.channel.send("You have instead decided to take over " + user.username + ".")
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
            //if(message.author.id == user.id) return; // cant vote for yourself
            //if(user.id == currentGame.fraud.id) return message.author.send("*You can't vote for the original Fraud. You must try to find the one they've taken over.*"); // cant vote for the older fraud
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
        let shownName = message.author.username;
        if(message.author.id == currentGame.fraud.id) shownName = currentGame.frauded.username
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
          transitionTrial(currentlyPlaying[message.author.id].id); // begin the trial!
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
      } else if(message.content == "!innocent" || message.content == "!cancel") {
        let nu = currentGame.guilties.findIndex((userID) => message.author.id == userID);
        currentGame.guilties.splice(nu, 1)
        message.channel.send("*Your vote has been taken back.*")
      }
      break;
  }
  if(currentGame.fraud.id == message.author.id && currentGame.frauded != null) return sendMessage("**" + currentGame.frauded.username + "**: " + message.content, currentGame.viewers)
  sendMessage("**" + message.author.username + "**: " + message.content, currentGame.viewers)
})

module.exports.help = {
  name: "Base",
  typename: "base",
  game: "The Migration",
  minPlayers: 1
}
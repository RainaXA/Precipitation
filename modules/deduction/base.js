let fs = require('fs')
const { MessageEmbed } = require('discord.js');

const roles = require('../../data/tm.json');

                     // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
const majorityCounts = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7]

function dayCycle(guID) {
  // phases:
  // 0 = discussion
  // 1 = voting
  // 2 = rest
  // 3 = justice
  // 8 = revoting
  let phase = new MessageEmbed();
  switch(gameInfo[guID].phase) {
    case -2: // begin day
      gameInfo[guID].phase = 0;
      sendMessage("**The sun begins to rise.**", gameInfo[guID].viewers)
      setTimeout(dayCycle, 5000, guID);
      break;
    case -1: // if there are deaths, announce them
    case 0: // begin discussion phase
      gameInfo[guID].phase++;
      let timer;
      if(gameInfo[guID].day == 0) { // first discussion phase is shorter
        timer = "10s";
        gameInfo[guID].phase = 2; // skip voting on first day
        setTimeout(dayCycle, 10000, guID);
      } else {
        timer = "45s";
        setTimeout(dayCycle, 45000, guID);
      }
      phase.setTitle("Day " + (gameInfo[guID].day + 1) + " - Discussion Phase - " + timer)
      phase.setColor("GREEN")
      if(gameInfo[guID].day == 0) {
        phase.setDescription("Nothing's happened, have a quick chat!")
      } else {
        phase.setDescription("Figure out who the Spies are!")
      }
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      break;
    case 1: // begin voting phase
      gameInfo[guID].phase++;
      phase.setTitle("Day " + (gameInfo[guID].day + 1) + " - Voting Phase - 30s")
      phase.setDescription("Vote for who you think the Spies are with `!vote`! You don't even have to type their full name!")
      phase.setColor("BLUE")
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 30000, guID)
      break;
    case 2: // begin rest phase
      gameInfo[guID].guilties = [];
      gameInfo[guID].phase = -2;
      gameInfo[guID].trials = 2;
      gameInfo[guID].votesAgainst = {};
      for(player of gameInfo[guID].players) {
        gameInfo[guID].votesAgainst[player.id] = [];
        gameInfo[guID].list[player.id].votedFor = null;
      }
      phase.setTitle("Day " + (gameInfo[guID].day + 1) + " - Resting Phase - 40s")
      phase.setColor("YELLOW")
      phase.setDescription("Use your night abilities! `!target` is how most roles will perform. (you'll see a message otherwise.)")
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 40000, guID)
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
      phase.setTitle("Day " + (gameInfo[guID].day + 1) + " - Voting Phase - 15s")
      phase.setDescription("Vote for who you think the Spies are with `!vote`! You don't even have to type their full name!")
      phase.setColor("DARK_BLUE")
      sendMessage({embeds: [phase]}, gameInfo[guID].viewers)
      setTimeout(dayCycle, 15000, guID)
      break;
  }
}

function win(guID, team) {
  gameInfo[guID].started = false;
  switch(team) {
    case 0: // fuck all lmao
    case 1:
    case 2:
      return sendMessage("**WIN!**", gameInfo[guID].viewers);
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
        sendMessage(gameInfo[guID].trial.name + "'s role was unknown. (not developed!)", gameInfo[guID].viewers)
        gameInfo[guID].phase = 2
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

function roleAssignment() {

}

function startGame(viewers, guildID) {
  gameInfo[guildID].day = 0;
  gameInfo[guildID].phase = -2;
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
  for(role of lists[String(gameInfo[guildID].players.length)]) {
    log(role, logging.warn, "test")
  }
  let rolesToAssign = lists[String(gameInfo[guildID].players.length)];
  for(player of viewers) { // assign roles!
    gameInfo[guildID].votesAgainst[player.id] = [];
    if(!gameInfo[guildID].list[player.id].dead) {
      let rng = Math.floor(Math.random() * rolesToAssign.length)
      gameInfo[guildID].list[player.id].role = rolesToAssign[rng].name.toLowerCase();
      player.send(gameInfo[guildID].list[player.id].role)
      gameInfo[guildID].players.splice(rng, 1)
    } else {
      player.send("Spectator")
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
    case -2:
      return message.channel.send("Don't talk! The Spies may overhear!")
      //return;
    case 0:
    case -1:
      return;
    case 2:
    case 8:
      if(message.content.startsWith("!vote ")) {
        let target = message.content.toLowerCase().slice(6)
        let submitted = false;
        for(user of currentGame.players) {
          if(user.name.toLowerCase().includes(target)) {
            if(message.author.id == user.id) return; // cant vote for yourself
            for(let i = 0; i < currentGame.votesAgainst[user.id].length; i++) {
              if(currentGame.votesAgainst[user.id][i] == message.author.id) return; // dont allow votes again
            }
            if(getTextInput(user, currentGame.dead, 2)) return; // don't allow votes for dead/spectators
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
          sendMessage("**" + message.author.username + " has voted against " + user.name + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
        } else {
          sendMessage("**" + message.author.username + " has changed their vote to " + user.name + ".** " + (majorityCounts[currentGame.aliveCount] - currentGame.votesAgainst[user.id].length) + " more votes to get them on trial.", currentGame.viewers)
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
      if(message.author.id != currentGame.trial.id) return; // since they cant take over, are they the one on trial?
      break;
    case 5:
      if(message.content == "!guilty") {
        if(message.author.id == currentGame.trial.id) return; // since they cant take over, are they the one on trial?
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
  sendMessage("**" + message.author.username + "**: " + message.content, currentGame.viewers)
})

module.exports.help = {
  name: "Base",
  typename: "base",
  game: "The Migration",
  minPlayers: 1
}
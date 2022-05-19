module.exports.run = async (message, args, parameter) => {
  let user = name(message.author)
  let pingMessages = ["Pinging...", "Ponging...", "Hacking the mainframe...",  "Going bowling with Roman...", "Trying to become funny...", "Making more ping messages...", "who's joe", "pay my onlyfans", "doin ya mom", "living the american dream", "don't care + didn't ask", "ooh, ee, ooh ah ah, ting tang, wallawallabingbang", "I TOLD THE WITCH DOCTOR I WAS IN LOVE WITH YOU", "will the real slim shady please stand up", "Telling the witch doctor I was in love with you...", "i think i'm going insane", "Expressing myself...", "omg, you're a redditor AND a discord mod?", "i use arch btw", "I've come to make an announcement", "CLARA", "jett rebibe me", "police crash green screen", "apparently i committed tax fraud but idk how that happened, i dont even pay tax????"];
  let raelynnTooCute = Math.floor(Math.random() * pingMessages.length)
  let startTime = Date.now();
  
  message.channel.send("<:ping_receive:502755206841237505> " + pingMessages[raelynnTooCute]).then(function(message) {
    switch(parameter) { // I'm aware you cannot combine the two. I'm sorry, that's how it is for now.
      case "no-name":
        message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey!")
        break;
      case "client-ping":
        message.edit("<:ping_transmit:502755300017700865> (" + Math.round(client.ws.ping) + "ms) Hey, " + user + "!");
        break;
      default:
        message.edit("<:ping_transmit:502755300017700865> (" + (Date.now() - startTime) + "ms) Hey, " + user + "!");
    }
  })
}

module.exports.help = {
    name: "ping",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

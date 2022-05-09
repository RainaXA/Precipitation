module.exports.run = async (client, message, args, parameter) => {
  let user = name(message.author)
  let pingMessages = ["Pinging...", "yeah i got you", "awooga", "i'm so random and quirky!!!", "ew are you a pisces? that makes you satan!", "i'm a scorpio so it makes sense for me to kill my whole family", "pay my onlyfans"];
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
    category: "General"
}

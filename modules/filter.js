// dependencies
// command :: config.js -- change the filter mode to a server

let fs = require('fs')
if(!fs.existsSync('./commands/config.js')) log("Could not find a command to change the word filter status. This may render Filter useless.", logging.warn, "FILTER")

try {
  var name = require('../commands/name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "PING")
  function name(user) {
    return user.username;
  }
}

client.on('messageCreate', message => {
  if(!message.guild) return; // do not do anything if it's a dm
  if (config.guilds[message.guild.id].settings.filter && getTextInput(message.content, host.slurs)) {
    message.channel.messages.fetch(message.id).then(message => message.delete())
    if(message.author.id != client.user.id) message.author.send("Hey, " + name(message.author) + "!\n\nThis server has banned very offensive words. Please refrain from using these words.")
  }
})

// dependencies
// command :: config.js -- change the filter mode to a server

let fs = require('fs')
if(!fs.existsSync('./commands/config.js') && !fs.existsSync('./commands/filter.js')) log("Could not find a command to change the word filter status. This may render Filter useless.", logging.warn, 2)

client.on('messageCreate', message => {
  if (config.guilds[message.guild.id].filter == true && getTextInput(message.content) == true) {
    message.channel.messages.fetch(message.id).then(message => message.delete())
    if(message.author.id != client.user.id) message.author.send("Hey, " + name(message.author) + "!\n\nThis server has banned very offensive words. Please refrain from using these words.")
  }
})


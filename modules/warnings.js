// dependencies
// command :: warn.js      -- create a warning create event against a user (no new warnings can be created)
// command :: rmwarn.js    -- create a warning remove event against a user (no warnings can be removed)
// command :: lswarn.js    -- list all found warnings of a user (warnings cannot even be seen)

let fs = require('fs')
if(!fs.existsSync('./commands/warn.js')) log("Could not find a command to warn a user. This may render Warnings useless.", logging.warn, 2)
if(!fs.existsSync('./commands/rmwarn.js')) log("Could not find a command to remove a warning from a user. This may render Warnings useless.", logging.warn, 2)
if(!fs.existsSync('./commands/lswarn.js'))log("Could not find a command to list warnings of a user. This may render Warnings useless.", logging.warn, 2)
if(!fs.existsSync('./commands/rmwarn.js') && !fs.existsSync('./commands/warn.js')) log("Warnings cannot be created or added, due to lack of commands. Warnings is a dysfunctional module.", logging.error, 3)


global.warningStage = {};
global.warnedUser = {};
global.removeWarnNumber = {};

client.on('messageCreate', function(message) {
    if(warningStage[message.author.id] == 3) {
    warningStage[message.author.id] = 0;
    if(!Array.isArray(config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id])) config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id] = [];
    if(message.content == "cancel") return message.channel.send("Okay, I won't warn " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + ".")
    if(getTextInput(message.content) == true) return message.channel.send("Sorry, but I personally won't warn for any offensive reason.")
    if(message.content.length > 200) return message.channel.send("That's too long of a reason, please shorten it.")
    config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].push(message.content)
    return message.channel.send("Okay, I've warned " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + " for \"" + message.content + "\".")
  } else if(warningStage[message.author.id] == 4) {
    if(message.content.toLowerCase() == "y" || message.content.toLowerCase() == "yes") {
      config.guilds[message.guild.id].warnings[warnedUser[message.author.id].id].splice(removeWarnNumber[message.author.id] - 1, 1)
      warningStage[message.author.id] = 0
      return message.channel.send("Okay, I've removed this warning from " + gender(warnedUser[message.author.id], "him", "her", "them", "them") + ".")
    }
    warningStage[message.author.id] = 0;
    return message.channel.send("Okay, cancelling.")
  }
  if(warningStage[message.author.id] == 1) warningStage[message.author.id] = 3; // prevent warnings from the same message
  if(warningStage[message.author.id] == 2) warningStage[message.author.id] = 4; // otherwise automatically cancels
});

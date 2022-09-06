const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
  var name = require('./name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "PING")
  function name(user) {
    return user.username;
  }
}

try {
  var find = require('./find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will not function.", logging.warn, "WARN")
}

module.exports = {
    data: new SlashCommandBuilder()
      .setName('rmwarn')
      .setDescription('Remove a warning from a user.')
      .addIntegerOption(int =>
        int.setName('id')
        .setDescription("Which warning to remove")
        .setRequired(true))
      .addUserOption(user =>
          user.setName('user')
          .setDescription('Which user to remove a warning from')
          .setRequired(true)),
};

module.exports.default = async (message, args, parameter) => {
  if(!args) return message.channel.send("Please return an argument.");
  let numArgs = (args.split(" "))[0]
  let newArgs = args.slice(numArgs.length + 1)
  if(newArgs && find) {
    var removeUser = find(newArgs.toLowerCase(), 1)
    if(!removeUser) return message.channel.send("Couldn't find a user by that name.")
  } else {
    return message.channel.send("Please enter a user.")
  }
  if(!config.users[removeUser.id]) config.users[removeUser.id] = {};
  if(!config.guilds[message.guild.id].warnings[removeUser.id]) config.guilds[message.guild.id].warnings[removeUser.id] = [];
  let userMember = false;
  message.guild.members.cache.each(member => {
      if(removeUser.id == member.id) {
          return userMember = true;
      }
  })
  if(!userMember) return message.channel.send("Sorry, but this user is not in the server.")
  if (isNaN(parseInt(numArgs)) || parseInt(numArgs) < 1 || parseInt(numArgs) > config.guilds[message.guild.id].warnings[removeUser.id].length) return message.channel.send("Please enter a valid number.")
  warnedUser[message.author.id] = removeUser;
  warningStage[message.author.id] = 2;
  removeWarnNumber[message.author.id] = numArgs;
  return message.channel.send("Removing warning #" + numArgs + " from " + removeUser.username + " (" + name(removeUser) + "). Are you sure?")
}

module.exports.slash = async (interaction) => {
  let int = interaction.options.getInteger('id');
  let user = interaction.options.getUser('user');
  if(!config.users[user.id]) config.users[user.id] = {};
  if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
  if (int < 1 || int > config.guilds[interaction.guild.id].warnings[user.id].length) return interaction.reply({ content: "Please enter a valid number.", ephemeral: true })
  warnedUser[interaction.user.id] = user;
  warningStage[interaction.user.id] = 4; // no message involved
  removeWarnNumber[interaction.user.id] = int;
  return interaction.reply({ content: "Removing warning #" + int + " from " + user.username + " (" + name(user) + "). Are you sure?" })
}

module.exports.help = {
    name: "rmwarn",
    desc: "Remove a warning from a user.",
    args: "**(warning id) (user)**",
    parameters: "",
    category: "Moderation",
}

module.exports.metadata = {
    allowDM: false,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": true,
      "console": false
    },
    permissions: {
      "user": [Permissions.FLAGS.MANAGE_NICKNAMES],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

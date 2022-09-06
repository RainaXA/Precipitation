const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

try {
  var find = require('./find.js').find;
} catch(err) {
  log("Find function could not be obtained. Command will not function.", logging.warn, "WARN")
}

try {
  var name = require('./name.js').name;
} catch(err) {
  log("Name function could not be obtained. Defaulting to basic name function.", logging.warn, "WARN")
  function name(user) {
    return user.username;
  }
}

client.on('ready', async() => { // init guilds on start
  client.guilds.cache.each(guild => {
    if(!config.guilds[guild.id].warnings) { // warning category
      config.guilds[guild.id].warnings = {};
      log("Initialized " + guild.name + " as guild. (config.guilds[guild.id].warnings)", logging.info, "WARN")
    }
  });
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user.')
        .addUserOption(option =>
          option.setName('user')
          .setDescription('The user to warn')
          .setRequired(true)),
};

module.exports.default = async (message, args, parameter) => {
  let user;
  if(args && find) {
    user = find(args.toLowerCase(), 1)
    if(!user) return message.channel.send("Couldn't find a user by that name.")
  } else {
    return message.channel.send("Please input a user.")
  }
  if(!config.users[user.id]) config.users[user.id] = {};
  if(!config.guilds[message.guild.id].warnings[user.id]) config.guilds[message.guild.id].warnings[user.id] = [];
  let userMember = false;
  message.guild.members.cache.each(member => {
      if(user.id == member.id) {
          return userMember = true;
      }
  })
  if(!userMember) return message.channel.send("Sorry, but this user is not in the server.")
  if(config.guilds[message.guild.id].warnings[user.id].length > 9) return message.channel.send("Sorry, but Precipitation currently only supports up to 9 warnings per user.")
  warnedUser[message.author.id] = user;
  message.channel.send("Please give a reason for warning " + user.tag + " (" + name(user) + ").");
  warningStage[message.author.id] = 1;
}

module.exports.slash = async (interaction) => {
  let user = interaction.options.getUser('user');
  if(!config.users[user.id]) config.users[user.id] = {};
  if(!config.guilds[interaction.guild.id].warnings[user.id]) config.guilds[interaction.guild.id].warnings[user.id] = [];
  if(config.guilds[interaction.guild.id].warnings[user.id].length > 9) return interaction.reply({ content: "Sorry, but Precipitation currently only supports up to 9 warnings per user.", ephemeral: true })
  warnedUser[interaction.user.id] = user;
  interaction.reply({ content: "Please give a reason for warning " + user.tag + " (" + name(user) + ")." })
  warningStage[interaction.user.id] = 3; // no messages involved
}

module.exports.help = {
    name: "warn",
    desc: "Warns a user.",
    args: "**(user)**",
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
      "user": [ Permissions.FLAGS.MANAGE_NICKNAMES ],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

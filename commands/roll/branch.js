const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

var releases = require("../../data/releases.json")

client.on('ready', async() => { // init guilds on start
  client.guilds.cache.each(guild => {
    if(!config.guilds[guild.id].branch) { // logging category
      config.guilds[guild.id].branch = "stable";
      log("Initialized " + guild.name + " as guild. (config.guilds[guild.id].branch)", logging.info, "BRANCH")
    }
  });
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('branch')
        .setDescription('Changes the branch from which the commands will be taken from.'),
};

module.exports.default = async (message, args, parameter) => {
  switch(args) {
    case "stable":
      config.guilds[message.guild.id].branch = "stable";
      return message.channel.send("Precipitation is now using the most tested and bug-free commands.")
    case "roll":
      config.guilds[message.guild.id].branch = "roll";
      return message.channel.send("Precipitation is now using new commands with less testing.")
    case "bleed":
      config.guilds[message.guild.id].branch = "bleed";
      return message.channel.send("Precipitation is now using very unstable commands for new features.")
    case "cat":
    case "cat-mode":
      config.guilds[message.guild.id].branch = "cat";
      return message.channel.send("UwU I'm a cat now");
    default:
      let embed = new MessageEmbed()
      .setTitle("Precipitation Branch Selection")
      .setDescription("The following is a list of all Precipitation branches that may be used. Switching between branches may allow for newer, alternate versions of commands to be used.")
      .addField("stable", "Refined and polished features at a slower pace.\n**Next release**: " + releases["stable"])
      .addField("roll", "Rolling release feature release schedules for features at a faster pace, with more instability.\n**Next release**: " + releases["roll"])
      .addField("bleed", "Bleeding edge features with new releases daily for the fastest pace with incredible instability.\n**Next release**: " + releases["bleed"])
      .addField("cat-mode", "Meow, meow! I'm a cat!")
      .setColor(host.colors[branch])
      .setFooter({ text: "Precipitation " + host.version.external, iconURL: client.user.displayAvatarURL() })
      return message.channel.send({embeds: [embed]})
  }
}

module.exports.slash = async (interaction) => {

}

module.exports.help = {
    name: "branch",
    desc: "Changes the branch from which the commands will be taken from.",
    args: "(stable | roll | bleed)",
    parameters: "",
    category: "General",
}

module.exports.metadata = {
    allowDM: false,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": false
    },
    permissions: {
      "user": [Permissions.FLAGS.MANAGE_GUILD],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

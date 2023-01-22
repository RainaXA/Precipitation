// dependencies
// command :: config.js -- change logging channels

let fs = require('fs')
if(!fs.existsSync('./commands/config.js')) log("Could not find a command to change the logging channel. This may render Logging useless.", logging.warn, 2)

const { MessageEmbed } = require('discord.js')

client.on('messageDelete', async function(message) {
	if(!message.guild) return;
  if(!config.guilds[message.guild.id].settings.logging.messages) return;
	let reason = "This message was deleted by another user.";
	if(config.guilds[message.guild.id].settings.filter && getTextInput(message.content, host.slurs)) reason = "This message was automatically deleted by Precipitation due to the filter."
	let deleteEmbed = new MessageEmbed()
	.setTitle("Deleted Message")
	.setDescription(message.author.tag + " - <#" + message.channel.id + ">")
	.addField("Content", message.content)
	.setColor("RED")
	.setFooter({ text: reason })
	.setTimestamp()
	message.guild.channels.cache.get(config.guilds[message.guild.id].settings.logging.messages).send({embeds: [deleteEmbed]})
});

client.on('messageUpdate', function(oldMessage, newMessage) {
	if(!oldMessage.guild) return;
  if(!config.guilds[oldMessage.guild.id].settings.logging.messages) return;
	if(oldMessage.content == newMessage.content) return; // if they're the exact same, don't show it!
	if(oldMessage.author.id == client.user.id) return;
	let editEmbed = new MessageEmbed()
	.setTitle("Edited Message")
	.setDescription(oldMessage.author.tag + " - <#" + oldMessage.channel.id + ">")
	.addField("Original Message", oldMessage.content)
	.addField("New Message", newMessage.content)
	.setColor("YELLOW")
	.setTimestamp()
	oldMessage.guild.channels.cache.get(config.guilds[oldMessage.guild.id].settings.logging.messages).send({embeds: [editEmbed]})
});

client.on('guildMemberAdd', async function(member) {
	if(!config.guilds[member.guild.id].settings) return;
  	if(!config.guilds[member.guild.id].settings.logging.members) return;
	let infoDisplay = new MessageEmbed()
	.setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL})
	.addField("Account Dates", "**Creation Date**: " + member.user.createdAt.toUTCString() + "\n**Join Date**: " + member.joinedAt.toUTCString())
	.setColor(host.colors[branch])
	member.guild.channels.cache.get(config.guilds[member.guild.id].settings.logging.members).send({ content: ":wave: <@" + member.user.id + "> [" + member.user.tag + "]", embeds: [infoDisplay]})
});

client.on('guildMemberRemove', async function(member) {
  if(!config.guilds[member.guild.id].settings.logging.members) return;
	member.guild.channels.cache.get(config.guilds[member.guild.id].settings.logging.members).send(":door: <@" + member.user.id + "> [" + member.user.tag + "]")
});

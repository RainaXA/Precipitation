/* ========================================================================= *\
    Logging: module for logging deleted/edited messages, and guild joins/leaves in Precipitation
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

let fs = require('fs')
if(!fs.existsSync('./commands/config.js')) log("Could not find a command to change the logging channel. This may render Logging useless.", logging.warn, 2)

const { MessageEmbed } = require('discord.js')

client.on('messageDelete', async function(message) {
	if(!message.guild) return;
	if(!config.guilds[message.guild.id].settings) return;
  	if(!config.guilds[message.guild.id].settings.logging.messages) return;
	let reason = "This message was deleted by another user.";
	if(config.guilds[message.guild.id].settings.filter && getTextInput(message.content, host.slurs)) reason = "This message was automatically deleted by Precipitation due to the filter."
	let deleteEmbed = new MessageEmbed()
	.setTitle("Deleted Message")
	.setDescription(message.author.tag + " - <#" + message.channel.id + ">")
	.addFields(
		{ name: "Content", content: message.content },
		{ name: "Message Time", content: "<t:" + parseInt(message.createdTimestamp / 1000, 10) + "> (" + parseInt(message.createdTimestamp / 1000, 10) + ")" })
	.setColor("RED")
	.setFooter({ text: reason })
	.setTimestamp()
	message.guild.channels.cache.get(config.guilds[message.guild.id].settings.logging.messages).send({embeds: [deleteEmbed]})
});

client.on('messageUpdate', function(oldMessage, newMessage) {
	if(!oldMessage.guild) return;
	if(!config.guilds[oldMessage.guild.id].settings) return;
  	if(!config.guilds[oldMessage.guild.id].settings.logging.messages) return;
	if(oldMessage.content == newMessage.content) return; // if they're the exact same, don't show it!
	if(oldMessage.author.id == client.user.id) return;
	let editEmbed = new MessageEmbed()
	.setTitle("Edited Message")
	.setDescription(oldMessage.author.tag + " - <#" + oldMessage.channel.id + ">")
	.addFields(
		{ name: "Original Message", content: oldMessage.content },
		{ name: "New Message", content: newMessage.content },
		{ name: "Message Time", content: "<t:" + parseInt(oldMessage.createdTimestamp / 1000, 10) + "> (" + parseInt(oldMessage.createdTimestamp / 1000, 10) + ")" })
	.setColor("YELLOW")
	.setTimestamp()
	oldMessage.guild.channels.cache.get(config.guilds[oldMessage.guild.id].settings.logging.messages).send({embeds: [editEmbed]})
});

client.on('guildMemberAdd', async function(member) {
	if(!config.guilds[member.guild.id].settings) return;
  	if(!config.guilds[member.guild.id].settings.logging.members) return;
	let infoDisplay = new MessageEmbed()
	.setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL})
	.addFields({ name: "Account Dates", content: "**Creation Date**: " + member.user.createdAt.toUTCString() + "\n**Join Date**: " + member.joinedAt.toUTCString()})
	.setColor(host.color)
	member.guild.channels.cache.get(config.guilds[member.guild.id].settings.logging.members).send({ content: ":wave: <@" + member.user.id + "> [" + member.user.tag + "]", embeds: [infoDisplay]})
});

client.on('guildMemberRemove', async function(member) {
	if(!config.guilds[member.guild.id].settings) return;
  	if(!config.guilds[member.guild.id].settings.logging.members) return;
	member.guild.channels.cache.get(config.guilds[member.guild.id].settings.logging.members).send(":door: <@" + member.user.id + "> [" + member.user.tag + "]")
});

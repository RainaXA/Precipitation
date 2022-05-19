module.exports.run = async (message, args, parameter) => {
  const { MessageEmbed } = require('discord.js')
  let uinfoUser;
  if(!args) uinfoUser = message.author;
  if(args) uinfoUser = find(args.toLowerCase(), "first", null, "list")
  if(uinfoUser == null) return message.channel.send("Please type a valid user.")
  initUser(uinfoUser)
  let userBirthday;
  if(config.users[uinfoUser.id].birthday.month == undefined) {
    userBirthday = "*not set*"
  } else {
      userBirthday = toProperUSFormat(config.users[uinfoUser.id].birthday.month, config.users[uinfoUser.id].birthday.day, config.users[uinfoUser.id].birthday.year)
  }
  let uinfoMember;
  message.guild.members.cache.each(member => {
    if(uinfoUser.id == member.id) {
      return uinfoMember = member;
    }
  })
  let joinedAt = "*not in server*";
  if (uinfoMember) joinedAt = uinfoMember.joinedAt;
  let uinfo = new MessageEmbed()
  .setTitle("User Information || " + uinfoUser.tag)
  .addFields(
    { name: "Account Dates", value: "**Creation Date**: " + uinfoUser.createdAt.toUTCString() + "\n**Join Date**: " + joinedAt.toUTCString(), inline: true },
    { name: "Names", value: "**Username**: " + uinfoUser.username + "\n**Display Name**: " + uinfoMember.displayName },
    { name: "Bot Info", value: "**Name**: " + name(uinfoUser) + "\n**Gender**: " + gender(uinfoUser, "Male", "Female", "Other", "*not set*") + "\n**Birthday**: " + userBirthday }
  )
  .setColor("BLUE")
  .setFooter({ text: 'Precipitation ' + version.external });
  return message.channel.send({embeds: [uinfo]})
}

module.exports.help = {
    name: "uinfo",
    desc: "Get information on a particular user.",
    args: "(user)",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

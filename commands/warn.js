module.exports.run = async (message, args, parameter) => {
    const { Permissions } = require('discord.js')
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) return message.channel.send("You don't have the required permissions to perform this action.")
    if (!args) return message.channel.send("Please input a user.")
    let uUser = find(args.toLowerCase(), "first", null, "list")
    if (uUser == null) return message.channel.send("Please input a valid user.")
    if(uUser.id == client.user.id) return message.channel.send("What did I do? :(")
    let userMember;
    message.guild.members.cache.each(member => {
        if(uUser.id == member.id) {
            return userMember = member;
        }
    })
    initUser(uUser)
    if(!config.guilds[message.guild.id].warnings[uUser.id]) config.guilds[message.guild.id].warnings[uUser.id] = [];
    if(!userMember) return message.channel.send("This user does exist, but they are not in the server.")
    if(config.guilds[message.guild.id].warnings[uUser.id].length > 9) return message.channel.send("Sorry, but Precipitation currently only supports up to 9 warnings. (this is because of lswarn...things will get spammy without pages real fast.)")
    warnedUser[message.author.id] = uUser;
    message.channel.send("Please give a reason for warning " + uUser.tag + " (" + name(uUser) + ").");
    warningStage[message.author.id] = 1;
}

module.exports.help = {
    name: "warn",
    desc: "Warn a user.",
    args: "**(user)**",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

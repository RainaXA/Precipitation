module.exports.run = async (message, args, parameter) => {
    const { Permissions } = require('discord.js')
    let purgeWarningList = "Please:\n";
    if(!args) purgeWarningList = purgeWarningList + "- enter an argument\n"
    let numArgs = (args.split(" "))[0]
    let newArgs = args.slice(numArgs.length + 1)
    if(!newArgs[0]) purgeWarningList = purgeWarningList + "- enter a user\n"
    let removeUser = find(newArgs.toLowerCase(), "first", null, "first")
    if (removeUser == null) purgeWarningList = purgeWarningList + "- ensure your user exists\n"
    let rmMember;
    if(removeUser) {
        message.guild.members.cache.each(member => {
        if(removeUser.id == member.id) {
            return rmMember = member;
        }
        })
        initUser(removeUser)
    }
    if(!rmMember) purgeWarningList = purgeWarningList + "- ensure your user is in the server\n"
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) purgeWarningList = purgeWarningList + "- ensure you have the current permissions\n"
    if(removeUser) {
        if(!config.guilds[message.guild.id].warnings[removeUser.id]) config.guilds[message.guild.id].warnings[removeUser.id] = [];
        if (isNaN(parseInt(numArgs)) || parseInt(numArgs) < 1 || parseInt(numArgs) > config.guilds[message.guild.id].warnings[removeUser.id].length) purgeWarningList = purgeWarningList + "- enter a valid number\n"
    } else {
        if (isNaN(parseInt(numArgs)) || parseInt(numArgs) < 1) purgeWarningList = purgeWarningList + "- enter a valid number\n"
    }
    if(purgeWarningList != "Please:\n") return message.channel.send(purgeWarningList)
    warnedUser[message.author.id] = removeUser;
    warningStage[message.author.id] = 2;
    removeWarnNumber[message.author.id] = numArgs;
    return message.channel.send("Removing warning #" + numArgs + " from " + removeUser.username + ". Are you sure?")
}

module.exports.help = {
    name: "rmwarn",
    desc: "Remove a warning from a user.",
    args: "**(warning id) (user)**",
    parameters: "",
    category: "Moderation",
    version: "1.0.0"
}

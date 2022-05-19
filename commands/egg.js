module.exports.run = async (message, args, parameter) => {
    message.channel.send(":egg:")
}

module.exports.help = {
    name: "egg",
    category: "Secrets",
    version: "1.0.0"
}

// original egg, now changed
/*
    if(args == "") return message.channel.send("Sorry, but it appears this command is unknown."); // nobody has to know ;)
    if(args.length >= 50) return message.channel.send("Sorry, but it appears this command is unknown.");
    if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Sorry, but it appears this command is unknown.");
    if(getTextInput(args) == true) return message.channel.send("I think that's a little too far..")
    return message.channel.send("how bout you go " + args + " some bitches?")
*/

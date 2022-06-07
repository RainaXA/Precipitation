module.exports.run = async (message, args, parameter) => {
    let insults = ["God, can't you shut up?", "You're lucky it takes me mere milliseconds to deal with idiots like you.", "Shut up. I can't be caught in public with you.", "Give me a break already, you've said enough today.", name(message.author) + ", I'm really done with you. Call back when I might care enough to talk.", "I'm not gonna insult you just to piss you off.", "Damn, that's crazy, " + gender(message.author, "bro", "sis", name(message.author)) + ".....but did I ask?"];
    let rng = Math.floor(Math.random() * insults.length)
    message.channel.send(insults[rng])
}

module.exports.help = {
    name: "insult",
    category: "Secrets",
    version: "1.0.0"
}

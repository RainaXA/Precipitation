module.exports.run = async (args) => {
  loadDiscordCommand(args)
}

module.exports.help = {
    name: "load",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

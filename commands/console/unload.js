module.exports.run = async (args) => {
  unloadDiscordCommand(args)
}

module.exports.help = {
    name: "unload",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

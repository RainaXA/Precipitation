module.exports.run = async (args) => {
  log("Ping!", logging.output, 1)
}

module.exports.help = {
    name: "ping",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

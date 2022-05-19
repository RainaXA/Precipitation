module.exports.run = async (args) => {
  log("\nPrecipitation Help Index", logging.output, 3)
  log("General", logging.output, 1)
  log("ping", logging.output, 0)
  log("help", logging.output, 0)
  log("eval\n", logging.output, 0)
}

module.exports.help = {
    name: "help",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

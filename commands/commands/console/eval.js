module.exports.run = async (args) => {
  try {
    eval(args + "\n")
  } catch(err) {
    log("Evaluation error: " + err, logging.error, 0)
  }
}

module.exports.help = {
    name: "eval",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

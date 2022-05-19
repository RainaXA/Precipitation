module.exports.run = async (args) => {
  try {
    let config = require('../../config.json')
    loadCommand();
    log("Attempting to login to Discord...", logging.info, 1)
    client.login(config.general.token)
  } catch (err) {
    log("Precipitation could not login - most likely, the token is invalid.", logging.error, 2)
  }
}

module.exports.help = {
    name: "login",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

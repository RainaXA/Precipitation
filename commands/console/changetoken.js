module.exports.run = async (args) => {
  let fs = require('fs')
  let configuration = JSON.parse(fs.readFileSync("./config.json"))
  configuration.general.token = args
  fs.writeFile('config.json', JSON.stringify(configuration), function (err) {
    if (!err) log("Successfully changed the token. Use 'login' to use this new token.", logging.success, 0)
    if (err) log("Settings couldn't be saved!", logging.error, 3)
  })
}

module.exports.help = {
    name: "changetoken",
    desc: "Gets the current latency of the bot.",
    args: "",
    parameters: "[--no-name / --client-ping]",
    category: "General",
    version: "1.0.0"
}

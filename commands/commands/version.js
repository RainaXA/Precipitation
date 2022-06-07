module.exports.run = async (message, args, parameter) => {
    if(parameter.toLowerCase() == "show-internal") return message.channel.send("Precipitation " + version.internal)
    return message.channel.send("Precipitation " + version.external);
}

module.exports.help = {
    name: "version",
    alias: "ver",
    desc: "Shows the current bot version.",
    args: "",
    parameters: "[--show-internal]",
    category: "General",
    version: "1.0.0"
}

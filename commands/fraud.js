var command = {
    name: "fraud",
    desc: "DEPRECATED: Fraud is deprecated, please use `pr:deduction` instead.",
    args: "",
    parameters: "",
    execute: {
        discord: function(message, args) {
          message.channel.send("Fraud is deprecated! Please use `pr:deduction` instead.")
        }
    },
    ver: "3.0.0",
    cat: "Fun",
    prereqs: {
        dm: false,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
// console
// console only commands

var commands = {
    "eval": {
        name: "eval",
        desc: "Run a line of code.",
        args: "(code)",
        parameters: "",
        execute: {
            console: function(args) {
                eval(args)
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    },
    "shutdown": {
        name: "shutdown",
        desc: "Shuts down the bot.",
        args: "",
        parameters: "",
        execute: {
            console: function(args) {
                saveConfiguration();
                process.exit(0)
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    }
}

module.exports = commands;
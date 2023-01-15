// cmdctrl - command control
// loaded, unloaded, reloaded

var commands = {
    "load": {
        name: "load",
        desc: "Load a command into memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
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
    "unload": {
        name: "unload",
        desc: "Unloads a command from memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
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
try {
    var find = require('./find.js').exports.find;
  } catch(err) {
    log("find function not found - will display message author.", logging.warn, "uinfo")
}

var commands = {
    "time": {
        name: "time",
        desc: "See the time of another user.",
        args: "(user)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args && find) {
                    let user = find(args.toLowerCase(), 1);
                    if(!user) return message.channel.send("User not found.")
                    if(!config.users[user.id]) config.users[user.id] = {}
                    if(!config.users[user.id].offset && config.users[user.id].offset != 0) return message.channel.send("No offset found for this user, ask them to set it using `pr:settime`!")
                    let date = new Date()
                    let newHours = (date.getUTCHours() + config.users[user.id].offset);
                    if(newHours < 0) {
                        newHours = 24 - newHours
                    }
                    message.channel.send("**" + user.tag + "**: " + newHours + ":" + date.getUTCMinutes())
                } else {
                    if(!config.users[message.author.id]) config.users[message.author.id] = {}
                    if(!config.users[message.author.id].offset && config.users[message.author.id].offset != 0) return message.channel.send("No offset found, set it using `pr:settime`!")
                    let date = new Date()
                    let newHours = (date.getUTCHours() + config.users[message.author.id].offset);
                    if(newHours < 0) {
                        newHours = 24 - newHours
                    }
                    message.channel.send("**" + message.author.tag + "**: " + newHours + ":" + date.getUTCMinutes())
                }
            }
        },
        ver: "3.0.0",
        cat: "Time",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "settime": {
        name: "settime",
        desc: "Set your timezone.",
        args: "(UTC/GMT offset)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                args = parseInt(args);
                if(isNaN(args)) {
                    return message.channel.send("Please return a number.")
                }
                if(!config.users[message.author.id]) config.users[message.author.id] = {}
                config.users[message.author.id].offset = args
                message.channel.send("I've set your UTC/GMT timezone to " + args + ", use `pr:time` and see if it's accurate!")
            }
        },
        ver: "3.0.0",
        cat: "Time",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    }
}

module.exports = commands;
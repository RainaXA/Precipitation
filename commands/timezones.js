try {
    var find = require('./find.js').exports.find;
  } catch(err) {
    log("find function not found - will display message author.", logging.warn, "timezones")
}

try {
    var toProperUSFormat = require('./birthday.js').exports.toProperUSFormat;
  } catch(err) {
    log("united states date format function not found - not showing birthday.", logging.warn, "timezones")
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
                    let day;
                    let seconds = date.getUTCSeconds();
                    let minutes = date.getUTCMinutes();
                    if(config.users[message.author.id].offsetMin) {
                        minutes = minutes + config.users[message.author.id].offsetMin
                    }
                    if(minutes < 0) { // stupid damn utc offsets being OFF THE HOUR!!!
                        minutes = 60 + minutes
                        newHours = newHours - 1;
                    } else if(minutes > 60) {
                        minutes = minutes - 60
                        newHours = newHours + 1;
                    }
                    if(newHours < 0) {
                        newHours = 24 + newHours
                        day = date.getUTCDate() - 1;
                    } else if(newHours > 24) {
                        newHours = newHours - 24
                        day = date.getUTCDate() + 1;
                    } else {
                        day = date.getUTCDate();
                    }
                    if(newHours < 10) {
                        newHours = "0" + newHours;
                    }
                    if(minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    if(seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    message.channel.send("**" + message.author.tag + "**: " + toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear()) + ", " + newHours + ":" + minutes + ":" + seconds)
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
        args: "**(UTC/GMT offset)**",
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args == "-9.5" || args == "-3.5" || args == "3.5" || args == "4.5" || args == "5.5" || args == "5.75" || args == "6.5" || args == "8.75" || args == "9.5" || args == "10.5" || args == "12.75") {
                    if(args.startsWith("-") && args.endsWith(".5")) {
                        if(!config.users[message.author.id]) config.users[message.author.id] = {}
                        config.users[message.author.id].offsetMin = -30
                    } else if (args.endsWith(".5")) {
                        if(!config.users[message.author.id]) config.users[message.author.id] = {}
                        config.users[message.author.id].offsetMin = 30
                    } else if(args.startsWith("-") && args.endsWith(".75")) {
                        if(!config.users[message.author.id]) config.users[message.author.id] = {}
                        config.users[message.author.id].offsetMin = -45
                    } else if (args.endsWith(".75")) {
                        if(!config.users[message.author.id]) config.users[message.author.id] = {}
                        config.users[message.author.id].offsetMin = 45
                    }
                    config.users[message.author.id].offset = parseInt(args)
                    message.channel.send("I've set your UTC/GMT timezone to " + args + ", use `pr:time` and see if it's accurate!")
                } else {
                    args = parseInt(args);
                    if(isNaN(args)) {
                        return message.channel.send("Please return a number.")
                    } else if(args < -12 || args > 14) {
                        return message.channel.send("Please return a valid offset, between -12 and 14.")
                    }
                    if(!config.users[message.author.id]) config.users[message.author.id] = {}
                    config.users[message.author.id].offset = args
                    delete config.users[message.author.id].offsetMin;
                    message.channel.send("I've set your UTC/GMT timezone to " + args + ", use `pr:time` and see if it's accurate!")
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
    }
}

module.exports = commands;
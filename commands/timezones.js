const { MessageEmbed } = require('discord.js')

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

function utcOffsetFromTimezone(location) {
    switch (location) {
        case "sst":
            return -11;
        case "ckt":
        case "hast":
        case "taht":
            return -10;
        case "akst":
        case "hadt":
            return -9;
        case "pst":
        case "akdt":
            return -8;
        case "mst":
        case "pdt":
            return -7;
        case "cst":
        case "mdt":
            return -6;
        case "cdt":
        case "est":
            return -5;
        case "clt":
        case "cost":
        case "ect":
        case "edt":
            return -4;
        case "brt":
        case "clst":
            return -3;
        case "uyst":
            return -2;
        case "brst":
            return -1;
        case "utc":
        case "gmt":
            return 0;
        case "bst":
        case "cet":
        case "ist":
        case "met":
        case "wat":
            return 1;
        case "cat":
        case "cest":
        case "eet":
        case "ist":
        case "sast":
        case "wast":
            return 2;
        case "ast":
        case "eat":
        case "eest":
        case "fet":
        case "idt":
        case "iot":
        case "msk":
        case "trt":
            return 3;
        case "irst":
            return 3.5;
        case "amt":
        case "azt":
        case "get":
        case "gst":
        case "mut":
        case "ret":
        case "samt":
        case "sct":
        case "volt":
            return 4;
        case "aft":
        case "irdt":
            return 4.5;
        case "mawt":
        case "mvt":
        case "orat":
        case "pkt":
        case "tft":
        case "tmt":
        case "uzt":
        case "yekt":
            return 5;
        case "ist":
        case "slst":
            return 5.5;
        case "npt":
            return 5.75;
        case "bst":
        case "btt":
        case "kgt":
        case "omst":
        case "vost":
            return 6;
        case "cct":
        case "mmt":
            return 6.5;
        case "cxt":
        case "davt":
        case "hovt":
        case "novt":
        case "ict":
        case "krat":
        case "tha":
        case "wit":
            return 7;
        case "awst":
        case "bdt":
        case "chot":
        case "cit":
        case "cst":
        case "hkt":
        case "irkt":
        case "mst":
        case "pht":
        case "sgt":
        case "wst":
            return 8;
        case "eit":
        case "jst":
        case "kst":
        case "yakt":
            return 9;
        case "acst":
            return 9.5;
        case "aest":
        case "chst":
        case "ddut":
        case "pgt":
        case "vlat":
            return 10;
        case "acdt":
        case "lhst":
            return 10.5;
        case "aedt":
        case "lhst":
        case "mist":
        case "nct":
        case "sbt":
        case "vut":
            return 11;
        case "fjt":
        case "mht":
        case "nzst":
            return 12;
        case "nzdt":
        case "tkt":
        case "tot":
            return 13;
        default:
            return undefined;
    }
}

var commands = {
    "time": {
        name: "time",
        desc: "See the time of another user.",
        args: "(user)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args && find) { // guys im too lazyyyyy
                    let user = find(args.toLowerCase(), 1);
                    if(!user) return message.channel.send("User not found.")
                    if(!config.users[user.id]) config.users[user.id] = {}
                    if(!config.users[user.id].offset && config.users[user.id].offset != 0) return message.channel.send("No offset found for this user, ask them to set it using `pr:settime`!")
                    let date = new Date()
                    let newHours = (date.getUTCHours() + config.users[user.id].offset);
                    let day;
                    let seconds = date.getUTCSeconds();
                    let minutes = date.getUTCMinutes();
                    if(config.users[user.id].offsetMin) {
                        minutes = minutes + config.users[user.id].offsetMin
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
                    let time;
                    if(config.users[message.author.id].timePrefs) {
                        if(!config.users[message.author.id].timePrefs.time) config.users[message.author.id].timePrefs.time = 2;
                    }
                    switch(config.users[message.author.id].timePrefs.time) {
                        case 1:
                            let ampm;
                            if(newHours > 12) {
                                ampm = "PM"
                                newHours = newHours - 12
                            } else {
                                ampm = "AM"
                            }
                            time = newHours + ":" + minutes + ":" + seconds + ampm
                            break;
                        case 2:
                            time = newHours + ":" + minutes + ":" + seconds
                            break;
                        case 3:
                            let ampmm;
                            if(newHours > 12) {
                                ampmm = "PM"
                                newHours = newHours - 12
                            } else {
                                ampmm = "AM"
                            }
                            time = newHours + ":" + minutes + ampmm
                            break;
                        case 4:
                            time = newHours + ":" + minutes
                            break;
                    }
                    message.channel.send("**" + user.tag + "**: " + toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear()) + ", " + time)
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
                    let time;
                    if(config.users[message.author.id].timePrefs) {
                        if(!config.users[message.author.id].timePrefs.time) config.users[message.author.id].timePrefs.time = 2;
                    }
                    switch(config.users[message.author.id].timePrefs.time) {
                        case 1:
                            let ampm;
                            if(newHours > 12) {
                                ampm = "PM"
                                newHours = newHours - 12
                            } else {
                                ampm = "AM"
                            }
                            time = newHours + ":" + minutes + ":" + seconds + ampm
                            break;
                        case 2:
                            time = newHours + ":" + minutes + ":" + seconds
                            break;
                        case 3:
                            let ampmm;
                            if(newHours > 12) {
                                ampmm = "PM"
                                newHours = newHours - 12
                            } else {
                                ampmm = "AM"
                            }
                            time = newHours + ":" + minutes + ampmm
                            break;
                        case 4:
                            time = newHours + ":" + minutes
                            break;
                    }
                    message.channel.send("**" + message.author.tag + "**: " + toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear()) + ", " + time)
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
                let namedtz = utcOffsetFromTimezone(args.toLowerCase())
                if(namedtz || namedtz == 0) {
                    args = namedtz
                }
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
                    message.channel.send("I've set your UTC/GMT offset to " + args + ", use `pr:time` and see if it's accurate!")
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
                    message.channel.send("I've set your UTC/GMT offset to " + args + ", use `pr:time` and see if it's accurate!")
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
    "timeformat": {
        name: "timeformat",
        desc: "Set preferences on how to display time.",
        args: "**(day) (number)**",
        parameters: "",
        execute: {
            discord: function(message, args) {
                let multiargs = args.split(" ");
                if(!config.users[message.author.id]) config.users[message.author.id] = {}
                if(!config.users[message.author.id].timePrefs) config.users[message.author.id].timePrefs = {}
                switch(parseInt(multiargs[0])) {
                    case 1:
                    case 2:
                        return message.channel.send("Sorry, this feature doesn't exist yet. Check back later!")
                    case 3:
                        switch(parseInt(multiargs[1])) {
                            case 1:
                                config.users[message.author.id].timePrefs.time = 1;
                                return message.channel.send("Okay, I've set your time preference to `12:00:00AM`.")
                            case 2:
                                config.users[message.author.id].timePrefs.time = 2;
                                return message.channel.send("Okay, I've set your time preference to `00:00:00`.")
                            case 3:
                                config.users[message.author.id].timePrefs.time = 3;
                                return message.channel.send("Okay, I've set your time preference to `12:00AM`.")
                            case 4:
                                config.users[message.author.id].timePrefs.time = 4;
                                return message.channel.send("Okay, I've set your time preference to `00:00`.")
                            default:
                                let embed = new MessageEmbed()
                                .setTitle("Time Display Preferences >> Time")
                                .addField("Time Options", "**(1)** 12:00:00AM\n**(2)** 00:00:00\n**(3)** 12:00AM\n**(4)** 00:00")
                                .setColor(host.color)
                                .setFooter({text: "Precipitation " + host.version.external})
                                return message.channel.send({embeds: [embed]})
                        }
                }
                let embed = new MessageEmbed()
                .setTitle("Time Display Preferences")
                .addField("Options", "**(1)** Day\n**(2)** Date\n**(3)** Time")
                .setColor(host.color)
                .setFooter({text: "Precipitation " + host.version.external})
                message.channel.send({embeds: [embed]})
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
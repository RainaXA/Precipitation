/* ========================================================================= *\
    Timezones: Precipitation command to set timezone and view other timezones
    Copyright (C) 2023 Raina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.  
\* ========================================================================= */

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

function convertToMonth(month, type) {
    let wMonth;
    switch(type) {
        case 0:
            switch(month + 1) {
                case 1:
                wMonth = "January";
                break;
                case 2:
                wMonth = "February";
                break;
                case 3:
                wMonth = "March";
                break;
                case 4:
                wMonth = "April";
                break;
                case 5:
                wMonth = "May";
                break;
                case 6:
                wMonth = "June";
                break;
                case 7:
                wMonth = "July";
                break;
                case 8:
                wMonth = "August";
                break;
                case 9:
                wMonth = "September";
                break;
                case 10:
                wMonth = "October";
                break;
                case 11:
                wMonth = "November";
                break;
                case 12:
                wMonth = "December";
                break;
            }
            break;
        case 1:
            switch(month + 1) {
                case 1:
                wMonth = "Jan";
                break;
                case 2:
                wMonth = "Feb";
                break;
                case 3:
                wMonth = "Mar";
                break;
                case 4:
                wMonth = "Apr";
                break;
                case 5:
                wMonth = "May";
                break;
                case 6:
                wMonth = "Jun";
                break;
                case 7:
                wMonth = "Jul";
                break;
                case 8:
                wMonth = "Aug";
                break;
                case 9:
                wMonth = "Sep";
                break;
                case 10:
                wMonth = "Oct";
                break;
                case 11:
                wMonth = "Nov";
                break;
                case 12:
                wMonth = "Dec";
                break;
            }
            break;
    }
    return wMonth;
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
        alias: [],
        desc: "See the time of a user.",
        args: {
            "user": {
                "desc": "The user to see the time of",
                "required": false
            }
        },
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
                    let weekday = date.getUTCDay();
                    let shownDate;
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
                    weekday = String(weekday);
                    if(!config.users[message.author.id].timePrefs) config.users[message.author.id].timePrefs = {};
                    if(!config.users[message.author.id].timePrefs.time) config.users[message.author.id].timePrefs.time = 2;
                    if(!config.users[message.author.id].timePrefs.day) config.users[message.author.id].timePrefs.day = 1;
                    if(!config.users[message.author.id].timePrefs.date) config.users[message.author.id].timePrefs.date = 1;
                    switch(config.users[message.author.id].timePrefs.day) {
                        case 1:
                            weekday = weekday.replace("0", "Sunday").replace("1", "Monday").replace("2", "Tuesday").replace("3", "Wednesday").replace("4", "Thursday").replace("5", "Friday").replace("0", "Saturday")
                            break;
                        case 2:
                            weekday = weekday.replace("0", "Sun").replace("1", "Mon").replace("2", "Tues").replace("3", "Wed").replace("4", "Thurs").replace("5", "Fri").replace("0", "Sat")
                            break;
                        case 3:
                            weekday = weekday.replace("0", "Su").replace("1", "M").replace("2", "Tu").replace("3", "W").replace("4", "Th").replace("5", "F").replace("0", "Sa")
                            break;
                    }
                    switch(config.users[message.author.id].timePrefs.date) {
                        case 1:
                            shownDate = toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear());
                            break;
                        case 2:;
                            shownDate = convertToMonth(date.getUTCMonth(), 0) + " " + day + " " + date.getUTCFullYear()
                            break;
                        case 3:
                            shownDate = convertToMonth(date.getUTCMonth(), 1) + " " + day + " " + date.getUTCFullYear();
                            break;
                        case 4:
                            shownDate = day + " " + convertToMonth(date.getUTCMonth(), 1) + " " + date.getUTCFullYear();
                            break;
                        case 5:
                            shownDate = toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear()).slice(0, -6);
                            break;
                        case 6:
                            shownDate = convertToMonth(date.getUTCMonth(), 0) + " " + day
                            break;
                        case 7:
                            shownDate = convertToMonth(date.getUTCMonth(), 1) + " " + day
                            break;
                        case 8:
                            shownDate = day + " " + convertToMonth(date.getUTCMonth(), 1)
                            break;
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
                    message.channel.send("**" + user.tag + "**: " + weekday + ", " + shownDate + ", " + time)
                } else {
                    if(!config.users[message.author.id]) config.users[message.author.id] = {}
                    if(!config.users[message.author.id].offset && config.users[message.author.id].offset != 0) return message.channel.send("No offset found, set it using `pr:settime`!")
                    let date = new Date()
                    let newHours = (date.getUTCHours() + config.users[message.author.id].offset);
                    let day;
                    let seconds = date.getUTCSeconds();
                    let minutes = date.getUTCMinutes();
                    let weekday = date.getUTCDay();
                    let shownDate;
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
                        weekday = weekday - 1;
                    } else if(newHours > 24) {
                        newHours = newHours - 24
                        day = date.getUTCDate() + 1;
                        weekday = weekday + 1;
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
                    weekday = String(weekday);
                    if(!config.users[message.author.id].timePrefs) config.users[message.author.id].timePrefs = {};
                    if(!config.users[message.author.id].timePrefs.time) config.users[message.author.id].timePrefs.time = 2;
                    if(!config.users[message.author.id].timePrefs.day) config.users[message.author.id].timePrefs.day = 1;
                    if(!config.users[message.author.id].timePrefs.date) config.users[message.author.id].timePrefs.date = 1;
                    switch(config.users[message.author.id].timePrefs.day) {
                        case 1:
                            weekday = weekday.replace("0", "Sunday").replace("1", "Monday").replace("2", "Tuesday").replace("3", "Wednesday").replace("4", "Thursday").replace("5", "Friday").replace("0", "Saturday")
                            break;
                        case 2:
                            weekday = weekday.replace("0", "Sun").replace("1", "Mon").replace("2", "Tues").replace("3", "Wed").replace("4", "Thurs").replace("5", "Fri").replace("0", "Sat")
                            break;
                        case 3:
                            weekday = weekday.replace("0", "Su").replace("1", "M").replace("2", "Tu").replace("3", "W").replace("4", "Th").replace("5", "F").replace("0", "Sa")
                            break;
                    }
                    switch(config.users[message.author.id].timePrefs.date) {
                        case 1:
                            shownDate = toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear());
                            break;
                        case 2:;
                            shownDate = convertToMonth(date.getUTCMonth(), 0) + " " + day + " " + date.getUTCFullYear()
                            break;
                        case 3:
                            shownDate = convertToMonth(date.getUTCMonth(), 1) + " " + day + " " + date.getUTCFullYear();
                            break;
                        case 4:
                            shownDate = day + " " + convertToMonth(date.getUTCMonth(), 1) + " " + date.getUTCFullYear();
                            break;
                        case 5:
                            shownDate = toProperUSFormat((date.getUTCMonth() + 1), day, date.getUTCFullYear()).slice(0, -6);
                            break;
                        case 6:
                            shownDate = convertToMonth(date.getUTCMonth(), 0) + " " + day
                            break;
                        case 7:
                            shownDate = convertToMonth(date.getUTCMonth(), 1) + " " + day
                            break;
                        case 8:
                            shownDate = day + " " + convertToMonth(date.getUTCMonth(), 1)
                            break;
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
                    message.channel.send("**" + message.author.tag + "**: " + weekday + ", " + shownDate + ", " + time)
                }
            }
        },
        ver: "3.2.0",
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
        alias: [],
        desc: "Set your timezone.",
        args: {
            "timezone": {
                "desc": "The offset or specified timezone to set your timezone as",
                "required": true
            }
        },
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
        ver: "3.2.0",
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
        alias: [],
        desc: "Set preferences on how to display time.",
        args: {
            "setting": {
                "desc": "Number corresponding to Day, Date, or Time",
                "required": true
            },
            "option": {
                "desc": "Which setting to set Day, Date, or Time to",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                let multiargs = args.split(" ");
                if(!config.users[message.author.id]) config.users[message.author.id] = {}
                if(!config.users[message.author.id].timePrefs) config.users[message.author.id].timePrefs = {}
                switch(parseInt(multiargs[0])) {
                    case 1:
                        switch(parseInt(multiargs[1])) {
                            case 1:
                                config.users[message.author.id].timePrefs.day = 1;
                                return message.channel.send("Okay, I've set your day preference to `Thursday`.")
                            case 2:
                                config.users[message.author.id].timePrefs.day = 2;
                                return message.channel.send("Okay, I've set your day preference to `Thurs`.")
                            case 3:
                                config.users[message.author.id].timePrefs.day = 3;
                                return message.channel.send("Okay, I've set your day preference to `Th`.")
                            default:
                                let embed = new MessageEmbed()
                                .setTitle("Time Display Preferences >> Day")
                                .addField("Time Options", "**(1)** Thursday\n**(2)** Thurs\n**(3)** Th")
                                .setColor(host.color)
                                .setFooter({ text: "Precipitation " + bottomText, iconURL: client.user.displayAvatarURL() });
                                return message.channel.send({embeds: [embed]})
                        }
                    case 2:
                        switch(parseInt(multiargs[1])) {
                            case 1:
                                config.users[message.author.id].timePrefs.date = 1;
                                return message.channel.send("Okay, I've set your date preference to `January 1st, 1970`.")
                            case 2:
                                config.users[message.author.id].timePrefs.date = 2;
                                return message.channel.send("Okay, I've set your date preference to `January 1 1970`.")
                            case 3:
                                config.users[message.author.id].timePrefs.date = 3;
                                return message.channel.send("Okay, I've set your date preference to `Jan 1 1970`.")
                            case 4:
                                config.users[message.author.id].timePrefs.date = 4;
                                return message.channel.send("Okay, I've set your date preference to `1 Jan 1970`.")
                            case 5:
                                config.users[message.author.id].timePrefs.date = 5;
                                return message.channel.send("Okay, I've set your date preference to `January 1st`.")
                            case 6:
                                config.users[message.author.id].timePrefs.date = 6;
                                return message.channel.send("Okay, I've set your date preference to `January 1`.")
                            case 7:
                                config.users[message.author.id].timePrefs.date = 7;
                                return message.channel.send("Okay, I've set your date preference to `Jan 1`.")
                            case 8:
                                config.users[message.author.id].timePrefs.date = 8;
                                return message.channel.send("Okay, I've set your date preference to `1 Jan`.")
                            default:
                                let embed = new MessageEmbed()
                                .setTitle("Time Display Preferences >> Date")
                                .addField("Time Options", "**(1)** January 1st, 1970\n**(2)** January 1 1970\n**(3)** Jan 1 1970\n**(4)** 1 Jan 1970\n**(5)** January 1st\n**(6)** January 1\n**(7)** Jan 1\n**(8)** 1 Jan")
                                .setColor(host.color)
                                .setFooter({ text: "Precipitation " + bottomText, iconURL: client.user.displayAvatarURL() });
                                return message.channel.send({embeds: [embed]})
                        }
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
                                .setFooter({ text: "Precipitation " + bottomText, iconURL: client.user.displayAvatarURL() });
                                return message.channel.send({embeds: [embed]})
                        }
                }
                let embed = new MessageEmbed()
                .setTitle("Time Display Preferences")
                .addField("Options", "**(1)** Day\n**(2)** Date\n**(3)** Time")
                .setColor(host.color)
                .setFooter({ text: "Precipitation " + bottomText, iconURL: client.user.displayAvatarURL() });
                message.channel.send({embeds: [embed]})
            }
        },
        ver: "3.2.0",
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
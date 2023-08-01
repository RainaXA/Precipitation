/* ========================================================================= *\
    Ping: Precipitation command to show the client latency
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

const { SlashCommandBuilder } = require('@discordjs/builders');
const countries = forecast.require("../data/locations/countries.json");
const states = forecast.require("../data/locations/countries+states.json");
const cities = forecast.require("../data/locations/cities.json");

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

var cityAffirm = {};

global.getName = function(user) {
    if(!config.users[user.id].name) return user.username;
    return config.users[user.id].name;
}

global.getPronouns = function(user, naMessage, returnPronoun) { // 0 = subject, 1 = object, 2 = possessive, 3 = reflexive (she/her/hers/herself)
    if(!config.users[user.id].pronouns) return naMessage;
    if(!returnPronoun) return config.users[user.id].pronouns; // return full list if no desired returnPronoun
    return config.users[user.id].pronouns.split("/")[returnPronoun];
};

global.placeValue = function(num) {
    if(num.toString().endsWith("11") || num.toString().endsWith("12") || num.toString().endsWith("13")) {
      return num.toString() + "th";
    } else if(num.toString().endsWith("1")) { 
      return num.toString() + "st";
    } else if(num.toString().endsWith("2")) {
      return num.toString() + "nd";
    } else if(num.toString().endsWith("3")) {
      return num.toString() + "rd";
    } else {
      return num.toString() + "th";
    }
}

global.returnMonth = function(month, type) {
    if(type) return shortMonths[month];
    return months[month];
}

global.daysInMonth = function(month, year) {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) days[1] = 29; // leap year
    return days[month];
}

global.birthday = function(birthday) { //only returns US format for now
    if(!birthday) return "*not set*";
    let month = birthday.month;
    let day = birthday.day;
    let year = birthday.year;
    if(!day) return returnMonth(month);
    if(!year) return returnMonth(month) + " " + placeValue(day);
    return returnMonth(month) + " " + placeValue(day) + ", " + year;
}

global.location = function(user) {
    if(!config.users[user.id].location) return "*not set*";
    if(config.users[user.id].location.city) {
        return config.users[user.id].location.city + ", " + config.users[user.id].location.state + ", " + config.users[user.id].location.country;
    } else if(config.users[user.id].location.state) {
        return config.users[user.id].location.state + ", " + config.users[user.id].location.country;
    } else if(config.users[user.id].location.country) {
        return config.users[user.id].location.country;
    } else {
        return config.users[user.id].location.continent;
    }
}

var commands = {
    "name": {
        name: "name",
        alias: [],
        desc: "Sets a preferred name.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(args.length >= 75) return message.channel.send("That's too long of a name.")
                if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("I won't ping anyone.")
                if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
                if(args.includes("\n")) return message.channel.send("Please keep your name inside of one line.")
                if(args == "") {
                    config.users[message.author.id].name = null;
                    return message.channel.send("Sure, I'll refer to you by your username.")
                }
                config.users[message.author.id].name = args;
                return message.channel.send("Sure, I'll refer to you by \"" + args + "\".")
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Check back soon!" })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "pronouns": {
        name: "pronouns",
        alias: ["gender"],
        desc: "Sets pronouns for the bot to refer to you as.",
        args: {
            "pronouns": {
              "desc": "What pronouns for the bot to refer to you as",
              "required": false
            }
          },
        parameters: "",
        execute: {
            discord: function(message, args) {
                let noArgs = "You must have four arguments containing your preferred pronouns. In order, it must be `subject/object/possessive/reflexive`.\n\nFor example, `he/him/his/himself`, `she/her/hers/herself`, or `they/them/theirs/themself`."
                let aargs = args.split("/")
                if(!aargs[3] || aargs[4]) {
                    return message.channel.send(noArgs);
                } else { // do some checks for bad shit
                    if((args.includes("<@") && args.includes(">")) || args.includes("@everyone") || args.includes("@here")) return message.channel.send("Your pronouns cannot involve pinging others.")
                    if(getTextInput(args, host.slurs)) return message.channel.send("Hey, I'm not going to yell out offensive words.")
                    if(args.includes("\n")) return message.channel.send("Please keep your pronouns inside of one line.")
                    if(aargs[0].length >= 10) return message.channel.send("Your subject pronoun needs to be kept below 10 characters.")
                    if(aargs[1].length >= 10) return message.channel.send("Your object pronoun needs to be kept below 10 characters.")
                    if(aargs[2].length >= 10) return message.channel.send("Your possessive pronoun needs to be kept below 10 characters.")
                    if(aargs[3].length >= 15) return message.channel.send("Your reflexive pronoun needs to be kept below 15 characters.")
                    if(aargs[0].length == 0 || aargs[1].length == 0 || aargs[2].length == 0 || aargs[3].length == 0) return message.channel.send(noArgs);
                    config.users[message.author.id].pronouns = args;
                    return message.channel.send("From now on, I will now refer to you using the pronouns " + args + ".")
                }
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Check back soon!" })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "birthday": {
        name: "birthday",
        alias: ["bday"],
        desc: "Sets a birthday.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                if(!config.users[message.author.id]) config.users[message.author.id] = {}
                if(forecast.arrays.getText(args.toLowerCase(), shortMonths, 0)) {
                    if(!config.users[message.author.id].birthday) config.users[message.author.id].birthday = {}
                    args = args.split(" ");
                    if(!args[1]) {
                        let index = shortMonths.findIndex(m => args[0].toLowerCase() == m);
                        config.users[message.author.id].birthday.month = parseInt(index);
                        config.users[message.author.id].birthday.day = null;
                        config.users[message.author.id].birthday.year = null;
                        return message.channel.send("Setting your birthday to only show " + months[index] + ".");
                    } else if(!args[2]) { // only month and day
                        let index = shortMonths.findIndex(m => args[0].toLowerCase() == m);
                        if(index == -1) {
                            index = shortMonths.findIndex(m => args[1].toLowerCase() == m); // we know it has to exist
                            config.users[message.author.id].birthday.month = parseInt(index);
                            config.users[message.author.id].birthday.day = parseInt(args[0]);
                            config.users[message.author.id].birthday.year = null;
                            return message.channel.send("Setting your birthday to show " + parseInt(args[0]) + " " + months[index] + ".");
                        } else {
                            config.users[message.author.id].birthday.month = parseInt(index);
                            config.users[message.author.id].birthday.day = parseInt(args[1]);
                            config.users[message.author.id].birthday.year = null;
                            return message.channel.send("Setting your birthday to show " + parseInt(args[1]) + " " + months[index] + ".");
                        }
                    } else { // all arguments present
                        if(args[3]) return message.channel.send("This command doesn't support 4 arguments.")
                        let index = shortMonths.findIndex(m => args[0].toLowerCase() == m);
                        if(index == -1) {
                            index = shortMonths.findIndex(m => args[1].toLowerCase() == m);
                            if(index == -1) {
                                index = shortMonths.findIndex(m => args[2].toLowerCase() == m); // we know it has to exist here
                                let day;
                                let year;
                                if(args[0] > 1907) year = args[0]; // this is the year!
                                if(args[1] > 1907) year = args[1]; // this is the year!
                                if(!year) return message.channel.send("It appears you don't have a year.");
                                if(args[0] <= daysInMonth(index, year)) day = args[0]; // day
                                if(args[1] <= daysInMonth(index, year)) day = args[1]; // day
                                if(!day) return message.channel.send("It appears you don't have a day set.");
                                config.users[message.author.id].birthday.month = parseInt(index);
                                config.users[message.author.id].birthday.day = parseInt(day);
                                config.users[message.author.id].birthday.year = parseInt(year);
                                return message.channel.send("Setting your birthday to show " + day + " " + months[index] + " " + year + ".");
                            } else { // month is second arg
                                let day;
                                let year;
                                if(args[0] > 1907) year = args[0]; // this is the year!
                                if(args[2] > 1907) year = args[2]; // this is the year!
                                if(!year) return message.channel.send("It appears you don't have a year.");
                                if(args[0] <= daysInMonth(index, year)) day = args[0]; // day
                                if(args[2] <= daysInMonth(index, year)) day = args[2]; // day
                                if(!day) return message.channel.send("It appears you don't have a day set.");
                                config.users[message.author.id].birthday.month = parseInt(index);
                                config.users[message.author.id].birthday.day = parseInt(day);
                                config.users[message.author.id].birthday.year = parseInt(year);
                                return message.channel.send("Setting your birthday to show " + day + " " + months[index] + " " + year + ".");
                            }
                        } else { // month is first arg
                            let day;
                            let year;
                            if(args[1] > 1907) year = args[1]; // this is the year!
                            if(args[2] > 1907) year = args[2]; // this is the year!
                            if(!year) return message.channel.send("It appears you don't have a year.");
                            if(args[1] <= daysInMonth(index, year)) day = args[1]; // day
                            if(args[2] <= daysInMonth(index, year)) day = args[2]; // day
                            if(!day) return message.channel.send("It appears you don't have a day set.");
                            config.users[message.author.id].birthday.month = parseInt(index);
                            config.users[message.author.id].birthday.day = parseInt(day);
                            config.users[message.author.id].birthday.year = parseInt(year);
                            return message.channel.send("Setting your birthday to show " + day + " " + months[index] + " " + year + ".");
                        }
                    }
                } else {
                    return message.channel.send("Please type a short month, consisting of three letters.");
                }
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Check back soon!" });
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "location": {
        name: "location",
        alias: [],
        desc: "Sets your current location.",
        args: {
            "type": {
                "desc": "The type of location to set your location to\n`continent` `country` `state | province` `city`",
                "required": true
            },
            "location": {
                "desc": "Which continent, country, state/province, or city to set",
                "required": true
            }
        },
        parameters: "",
        execute: {
            discord: function(message, args) {
                let cArg = args.toLowerCase().split(" ");
                if(!cArg[0]) return message.channel.send("Please return an argument.");
                args = args.toLowerCase().slice(cArg[0].length + 1);
                if(!config.users[message.author.id]) config.users[message.author.id] = {};
                if(!config.users[message.author.id].location) config.users[message.author.id].location = {};
                switch(cArg[0]) {
                    /*case "continent":
                        if(!locations.continents[args]) return message.channel.send("Please enter a valid continent.");
                        config.users[message.author.id].location = {};
                        config.users[message.author.id].location.continent = locations.continents[args]
                        return message.channel.send("Okay, you will now appear to be from " + config.users[message.author.id].location.continent + ".");
                    */case "country":
                        let valid = false;
                        countries.forEach(country => {
                            if(country.name.toLowerCase() == args || country.iso3.toLowerCase() == args || country.iso2.toLowerCase() == args) {
                                config.users[message.author.id].location = {}
                                config.users[message.author.id].location.country = country.name;
                                config.users[message.author.id].location.continent = country.region;
                                valid = true;
                                cityAffirm[message.author.id] = null;
                                return message.channel.send("Okay, you will now appear to be from " + country.name + ".")
                            }
                        })
                        if(!valid) {
                            return message.channel.send("Please enter a valid country.")
                        }
                        break;
                    case "state":
                    case "province":
                        let stateee = [];
                        states.forEach(country => {
                            country.states.forEach(state => {
                                if(state.name.toLowerCase() == args || state.state_code.toLowerCase() == args) {
                                    stateee.push(state.name + ", " + country.name)
                                }
                            })
                        })
                        if(stateee.length == 0) {
                            cityAffirm[message.author.id] = null;
                            return message.channel.send("That state/province wasn't found. Please ensure there are no typos.")
                        } else if(stateee.length == 1) {
                            let setItems = stateee[0].split(", ");
                            config.users[message.author.id].location = {}
                            config.users[message.author.id].location.state = setItems[0];
                            config.users[message.author.id].location.country = setItems[1];
                            cityAffirm[message.author.id] = null;
                            return message.channel.send("Okay, you will now appear to be from " + stateee[0] + ".")
                        } else {
                            let list = "";
                            for(let i = 0; i < stateee.length; i++) {
                                list = list + "[" + i + "] " + stateee[i] + "\n";
                            }
                            cityAffirm[message.author.id] = {};
                            cityAffirm[message.author.id].check = 1;
                            cityAffirm[message.author.id].anger = 2;
                            cityAffirm[message.author.id].states = stateee;
                            return message.channel.send("There are multiple options for your state/province. Please type the number corresponding to one of the following:\n\n" + list);
                        }
                    case "city":
                        let cityyyy = [];
                        cities.forEach(city => {
                            if(city.name.toLowerCase() == args) {
                                cityyyy.push(city.name + ", " + city.state_name + ", " + city.country_name);
                            }
                        })
                        if(cityyyy.length == 0) {
                            cityAffirm[message.author.id] = null;
                            return message.channel.send("That city wasn't found. Please ensure there are no typos.")
                        } else if(cityyyy.length == 1) {
                            let setItems = cityyyy[0].split(", ");
                            config.users[message.author.id].location = {}
                            config.users[message.author.id].location.city = setItems[0];
                            config.users[message.author.id].location.state = setItems[1];
                            config.users[message.author.id].location.country = setItems[2];
                            cityAffirm[message.author.id] = null;
                            return message.channel.send("Okay, you will now appear to be from " + cityyyy[0] + ".")
                        } else {
                            let list = "";
                            for(let i = 0; i < cityyyy.length; i++) {
                                list = list + "[" + i + "] " + cityyyy[i] + "\n";
                            }
                            cityAffirm[message.author.id] = {};
                            cityAffirm[message.author.id].check = 1;
                            cityAffirm[message.author.id].anger = 2;
                            cityAffirm[message.author.id].cities = cityyyy;
                            return message.channel.send("There are multiple options for your city. Please type the number corresponding to one of the following:\n\n" + list);
                        }
                }
            }
        },
        ver: "3.2.0",
        cat: "Personalization",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    },
    "time": {
        name: "time",
        alias: ["tz"],
        desc: "Checks your own or another user's time.",
        args: {},
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("it's not ready yet!")
            },
            slash: async function (interaction) {
                await interaction.reply({ content: "Check back soon!" })
            },
            console: function() {
                log("testing with the new handler!", logging.output)
            }
        },
        ver: "4.0.0",
        prereqs: {
            dm: true,
            owner: false,
            user: [],
            bot: []
        },
        unloadable: true
    }
}

client.on('messageCreate', function(message) {
    if(!cityAffirm[message.author.id]) return;
    if(cityAffirm[message.author.id].check == 1) return cityAffirm[message.author.id].check = 2;
    if(cityAffirm[message.author.id].check == 2) {
        if(message.content.toLowerCase() == "cancel") {
            cityAffirm[message.author.id] = null;
            return message.channel.send("Okay, cancelling.")
        } else if(cityAffirm[message.author.id].cities) {
            if(!cityAffirm[message.author.id].cities[parseInt(message.content)]) {
                cityAffirm[message.author.id].anger = cityAffirm[message.author.id].anger - 1;
                if(cityAffirm[message.author.id].anger == 0) {
                    cityAffirm[message.author.id] = null;
                    return message.channel.send("I'm automatically cancelling the city input to prevent spam.")
                }
                return message.channel.send("Please input a valid number, or use `cancel` to exit out of this.")
            }
            let setItems = cityAffirm[message.author.id].cities[parseInt(message.content)].split(", ");
            config.users[message.author.id].location = {}
            config.users[message.author.id].location.city = setItems[0];
            config.users[message.author.id].location.state = setItems[1];
            config.users[message.author.id].location.country = setItems[2];
            message.channel.send("Okay, you will now appear to be from " + cityAffirm[message.author.id].cities[parseInt(message.content)] + ".")
            cityAffirm[message.author.id] = null;
        } else if(cityAffirm[message.author.id].states) {
            if(!cityAffirm[message.author.id].states[parseInt(message.content)]) {
                cityAffirm[message.author.id].anger = cityAffirm[message.author.id].anger - 1;
                if(cityAffirm[message.author.id].anger == 0) {
                    cityAffirm[message.author.id] = null;
                    return message.channel.send("I'm automatically cancelling the state input to prevent spam.")
                }
                return message.channel.send("Please input a valid number, or use `cancel` to exit out of this.")
            }
            let setItems = cityAffirm[message.author.id].states[parseInt(message.content)].split(", ");
            config.users[message.author.id].location = {}
            config.users[message.author.id].location.state = setItems[0];
            config.users[message.author.id].location.country = setItems[1];
            message.channel.send("Okay, you will now appear to be from " + cityAffirm[message.author.id].states[parseInt(message.content)] + ".")
            cityAffirm[message.author.id] = null;
        } else {
            return message.channel.send("Uhhh..this shouldn't have happened.")
        }
    }
});

module.exports = commands;
for(item in commands) {
    commands[item].data = new SlashCommandBuilder().setName(commands[item].name).setDescription(commands[item].desc)
}
module.exports.info = "Personalization";
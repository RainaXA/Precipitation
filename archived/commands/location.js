/* ========================================================================= *\
    Location: Precipitation command to set a location
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


    Furthermore, the databases in use for Precipitation are licensed by the
    Open Database License (ODbL-1.0).
\* ========================================================================= */

const countries = require("../data/locations/countries.json");
const states = require("../data/locations/countries+states.json");
const cities = require("../data/locations/cities.json");

var cityAffirm = {};

var command = {
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

module.exports = command;
module.exports.exports = {};
module.exports.exports.location = function (user) {
    if(!config.users[user.id].location) return null;
    if(config.users[user.id].location.city) {
        return config.users[user.id].location.city + ", " + config.users[user.id].location.state + ", " + config.users[user.id].location.country;
    } else if(config.users[user.id].location.state) {
        return config.users[user.id].location.state + ", " + config.users[user.id].location.country;
    } else if(config.users[user.id].location.country) {
        return config.users[user.id].location.country;
    } else {
        return config.users[user.id].location.continent;
    }
}; // export
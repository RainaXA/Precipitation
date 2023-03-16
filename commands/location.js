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
\* ========================================================================= */

var locations = require("../data/locations.json")

var command = {
    name: "location",
    desc: "Sets your current location.",
    args: "**(continent | country | state | province)**",
    parameters: "",
    execute: {
        discord: function(message, args) {
            let cArg = args.toLowerCase().split(" ");
            if(!cArg[0]) return message.channel.send("Please return an argument.");
            args = args.toLowerCase().slice(cArg[0].length + 1);
            if(!config.users[message.author.id]) config.users[message.author.id] = {};
            if(!config.users[message.author.id].location) config.users[message.author.id].location = {};
            switch(cArg[0]) {
                case "continent":
                    if(!locations.continents[args]) return message.channel.send("Please enter a valid continent.");
                    config.users[message.author.id].location = {};
                    config.users[message.author.id].location.continent = locations.continents[args]
                    return message.channel.send("Okay, you will now appear to be from " + config.users[message.author.id].location.continent + ".");
                case "country":
                    if(!locations.countries[args]) return message.channel.send("Please enter a valid country.");
                    config.users[message.author.id].location = {};
                    config.users[message.author.id].location.country = locations.countries[args];
                    config.users[message.author.id].location.continent = locations.links.countries[locations.countries[args]];
                    return message.channel.send("Okay, you will now appear to be from " + config.users[message.author.id].location.country + ".");
                case "state":
                case "province":
                    if(!locations.states[args]) return message.channel.send("Please enter a valid state/province.");
                    config.users[message.author.id].location = {};
                    config.users[message.author.id].location.state = locations.states[args]
                    config.users[message.author.id].location.country = locations.links.states[locations.states[args]];
                    config.users[message.author.id].location.continent = locations.links.countries[config.users[message.author.id].location.country];
                    return message.channel.send("Okay, you will now appear to be from " + config.users[message.author.id].location.state + ", " + config.users[message.author.id].location.country + ".");
            }
        }
    },
    ver: "3.0.0",
    cat: "Personalization",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.exports = {};
module.exports.exports.location = function (user) {
    if(!config.users[user.id].location) return null;
    if(config.users[user.id].location.state) {
        return config.users[user.id].location.state + ", " + config.users[user.id].location.country;
    } else if(config.users[user.id].location.country) {
        return config.users[user.id].location.country;
    } else {
        return config.users[user.id].location.continent;
    }
}; // export
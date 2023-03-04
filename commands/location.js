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
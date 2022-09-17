const { SlashCommandBuilder } = require('@discordjs/builders');

var locations = require("../../data/locations.json")

function location(user) {
  if(!config.users[user.id].location) return null;
  if(config.users[user.id].location.state) {
    return config.users[user.id].location.state + ", " + config.users[user.id].location.country;
  } else if(config.users[user.id].location.country) {
    return config.users[user.id].location.country;
  } else {
    return config.users[user.id].location.continent;
  }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('location')
        .setDescription('Sets your current location.'),
};

module.exports.location = location;

module.exports.default = async (message, args, parameter) => {
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
      if(!locations.states[args]) return message.channel.send("Please enter a valid U.S. state. *(Don't worry, there will be more than just the USA.)*");
      config.users[message.author.id].location = {};
      config.users[message.author.id].location.state = locations.states[args];
      config.users[message.author.id].location.country = "United States";
      config.users[message.author.id].location.continent = "North America";
      return message.channel.send("Okay, you will now appear to be from " + config.users[message.author.id].location.state + ".");
  }
}

module.exports.help = {
    name: "location",
    desc: "Sets your current location.",
    args: "**(continent)** (location)",
    parameters: "",
    category: "Personalization",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true,
    requireOwner: false
}

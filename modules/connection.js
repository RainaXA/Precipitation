/* ========================================================================= *\
    Connection: Forecast module for handling Discord connection from Precipitation
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

global.package = require("../package.json")
const execSync = require('child_process').execSync;

global.host = require('../host.json')

sources.dependencies = "dependencies"
sources.connection = "connection"

global.discordJsVersion;
try {
  discordJsVersion = package.dependencies["discord.js"].slice(1) // installed version
} catch (err) {
  log("discord.js not found. bot cannot be loaded - exiting", logging.error, sources.dependencies)
  process.exit(0);
}
discordJsVersion = discordJsVersion.split(".")
if(discordJsVersion[0] != "14") {
  log("discord.js is not v14. bot will attempt to load but will most likely fail", logging.warn, sources.dependencies)
} else {
  let currentVersion = execSync("npm view discord.js version").toString().split("."); // current version
  if(discordJsVersion[1] < currentVersion[1]) log("there is a new minor version of discord.js v14 available through npm!", logging.info, sources.dependencies)
  if(discordJsVersion[2] < currentVersion[2].slice(0, -1)) log("there is a new patch of discord.js v14 available through npm!", logging.info, sources.dependencies) // slicing because npm lol
}

const { Client, GatewayIntentBits, Partials } = require('discord.js');
global.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent ], partials: [Partials.Channel] });

client.login(host.token)
client.on('ready', async() => {
  log('\nsuccessfully started precipitation ' + host.version.internal + " using discord.js@^" + discordJsVersion.join(".") + "\nrunning in " + client.guilds.cache.size + " guilds, with " + client.users.cache.size + " total users", logging.info)
  process.title += " - Precipitation " + host.version.internal + " using discord.js@" + package.dependencies["discord.js"] // reset it
})

// CONNECTION STATES
client.on('shardReconnecting', function() {
  log("Precipitation is currently disconnected and attempting to reconnect.", logging.warn, sources.connection);
});

client.on('shardDisconnect', function() {
  log("\nPrecipitation has disconnected and will not reconnect.", logging.error, sources.connection);
  log("You'll need to restart Precipitation to reconnect.", logging.output, sources.connection)
});

client.on('shardResume', function(replayed) {
  log("Precipitation has reconnected - " + replayed + " events were replayed.", logging.success, sources.connection)
})

module.exports.info = {
  name: "Precipitation Connection",
  desc: "Module that establishes Precipitation's connection to Discord",
  ver: "1.0.0",
  fVer: "1.2.0"
}
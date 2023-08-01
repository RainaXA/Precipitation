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

const fs = require('fs');

global.getTextInput = function(text, list, type) { // true = don't check caps 
  if(!type) { // case-insensitive
    for(let i = 0; i < list.length; i++) {
      if(text.toLowerCase().includes(list[i])) return true;
    }
  } else if (type == 1) { // case-sensitive
    for(let i = 0; i < list.length; i++) {
      if(text.includes(list[i])) return true;
    }
  } else if (type == 2) { // numerical or other non-string
    for(let i = 0; i < list.length; i++) {
      if(text == list[i]) return true;
    }
  } else if (type == 3) { // remove spaces, case-insensitive
    for(let i = 0; i < list.length; i++) {
      if(text.replace(/\s+/g, '').toLowerCase().includes(list[i])) return true;
    }
  }
  return false;
}

// DATABASE
if(!fs.existsSync('./config.json')) {
  log('config.json does not exist - creating now', logging.warn, sources.commands)
  global.config = {
    "guilds": {

    },
    "users": {

    }
  };
  fs.writeFile('config.json', JSON.stringify(config), function (err) {
    if (err) throw err;
  })
} else {
  global.config = JSON.parse(fs.readFileSync("./config.json"));
}
setTimeout(saveConfiguration, 120000);

function saveConfiguration() {
  fs.writeFile('./config.json', JSON.stringify(config), function (err) {
    if (err) log("Settings couldn't be saved!", logging.error, "config")
  })
  setTimeout(saveConfiguration, 120000); // save again in 120 seconds
}

module.exports.info = {
  name: "Precipitation Miscellaneous",
  desc: "Module for other Precipitation functions",
  ver: "1.0.0",
  fVer: "1.2.0"
}
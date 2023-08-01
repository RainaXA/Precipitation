/* ========================================================================= *\
    Status: Forecast module for setting the playing status in Precipitation
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

const host = require('../host.json');

let status = {
  content: host.version.external + " " + host.version.name + " || " + host.prefix + "help",
  phase: 0
}

function setStatus() {
  switch(status.phase) {
    case 0:
      status.content = host.version.external + " " + host.version.name + " || " + host.prefix + "help"
      status.phase++;
      setTimeout(setStatus, 30000)
      break;
    case 1:
      status.content = client.guilds.cache.size + " servers || " + host.prefix + "help"
      status.phase++;
      setTimeout(setStatus, 30000)
      break;
    case 2:
      var uptime = parseInt(client.uptime);
      uptime = Math.floor(uptime / 1000);
      var seconds = Math.floor(uptime);
      var minutes = Math.floor(uptime / 60);
      var hours = 0;
      var days = 0;
      while (seconds >= 60) {
        seconds = seconds - 60;
      }
      while (minutes >= 60) {
        hours++;
        minutes = minutes - 60;
      }
      while (hours >= 24) {
        days++;
        hours = hours - 24;
      }
      if(days < 10) {
        days = "0" + days
      }
      if(hours < 10) {
        hours = "0" + hours
      }
      if(minutes < 10) {
        minutes = "0" + minutes
      }
      if(seconds < 10) {
        seconds = "0" + seconds
      }
      status.content = days + ":" + hours + ":" + minutes + ":" + seconds + " || " + host.prefix + "help"
      if(seconds == 25 || seconds == 55) { // last 5 seconds update to next phase instead of going to 30 seconds
        status.phase = 0;
      }
      if(seconds == 1 || seconds == 31) {
        setTimeout(setStatus, 4000) // I DON'T FEEL LIKE A PROPER FIX LMAO
      } else {
        setTimeout(setStatus, 5000)
      }
      break;
  }
  client.user.setActivity(status.content);
}

client.on('ready', async() => { // init guilds on start
  setStatus(); // make sure playing status does not expire
})

module.exports.info = {
  name: "Precipitation Status",
  desc: "Module that establishes Precipitation's Discord status",
  ver: "1.0.0",
  fVer: "1.2.0"
}
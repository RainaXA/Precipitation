/* ========================================================================= *\
    Connection: simple module used for logging connection states
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

client.on('shardReconnecting', function() { // these have never worked so I want to see if they'll work now
    log("Precipitation is currently disconnected and attempting to reconnect.", logging.warn, "connection");
});

client.on('shardDisconnect', function() {
    log("\nPrecipitation has disconnected and will not reconnect.", logging.error, "connection");
    log("You'll need to restart Precipitation to reconnect.", logging.output, "connection")
});

client.on('shardResume', function(replayed) {
  log("Precipitation has reconnected - " + replayed + " events were replayed.", logging.success, "connection")
})

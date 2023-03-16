/* ========================================================================= *\
    Console: Precipitation commands for use within the console
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

var commands = {
    "eval": {
        name: "eval",
        desc: "Run a line of code.",
        args: "(code)",
        parameters: "",
        execute: {
            console: function(args) {
                eval(args)
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    },
    "shutdown": {
        name: "shutdown",
        desc: "Shuts down the bot.",
        args: "",
        parameters: "",
        execute: {
            console: function(args) {
                log("saving configuration file", logging.success, "shutdown")
                fs.writeFile('config.json', JSON.stringify(config), function (err) {
                    if (!err) {
                        log("now exiting precipitation", logging.success, "shutdown")
                        process.exit()
                    }
                    if (err) log("configuration file could not be saved!\nprecipitation will not be shut down due to this.", logging.error, "shutdown")
                  })
            }
        },
        ver: "3.0.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    }
}

module.exports = commands;
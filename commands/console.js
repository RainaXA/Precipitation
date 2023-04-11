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
        alias: [],
        desc: "Run a line of code.",
        args: {
            "code": {
                "desc": "The code to execute",
                "required": true
            }
        },
        parameters: "",
        execute: {
            console: function(args) {
                eval(args)
            }
        },
        ver: "3.2.0",
        cat: "Owner",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    } // will be more soon! (may merge with fs...)
}

module.exports = commands;
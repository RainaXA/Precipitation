/* ========================================================================= *\
    Command Control: WIP commands
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

var commands = {
    "load": {
        name: "load",
        desc: "Load a command into memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
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
    "unload": {
        name: "unload",
        desc: "Unloads a command from memory.",
        args: "(command)",
        parameters: "",
        execute: {
            discord: function(message, args) {
                message.channel.send("This command needs to be rewritten entirely for Shorthair. C'mon Raina, fix it already!")
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
/* ========================================================================= *\
    File System: WIP command
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
const path = require('path')

// DIRECTORY
global.currentDirectory = path.resolve("./");

// SHUTDOWN
let shutdown = false;
let shutdownMessage;
let ignore = false;

function cancelShutdown(code) {
    if(!shutdown) return;
    shutdown = false;
    ignore = false;
    switch(code) {
        case 0: // time
            return shutdownMessage.edit("*The shutdown has been cancelled because the time has expired.*")
        case 1: // improper save
            return shutdownMessage.edit("*The shutdown has been cancelled because the configuration file couldn't be properly saved.*")
        default:
            return shutdownMessage.edit("*The shutdown has been cancelled because of an unknown reason.*")
    }
}

var commands = {
    "vd": {
        name: "vd",
        alias: [],
        desc: "View the current directory.",
        args: {},
        parameters: "",
        execute: {
            console: function(args) {
                let path = currentDirectory;
                if(args) path = args;
                fs.readdir(path, {withFileTypes: true}, (err, files) => {
                    let list = "";
                    files.forEach(file => {
                        //console.log(file)
                        if(file.isDirectory()) {
                            list += "\x1b[34m" + file.name + " <dir>\x1b[0m\n"
                        } else {
                            list += /*"\x1b[90m" +*/ file.name + " \x1b[0m\n"
                        }
                    })
                    log("directory of " + path + "\n\n" + list, logging.output, "fs")
                })
            }
        },
        ver: "3.2.0",
        cat: "File System",
        prereqs: {
            dm: true,
            owner: true,
            user: [],
            bot: []
        },
        unloadable: false
    },
    "cd": {
        name: "cd",
        alias: [],
        desc: "Change the current directory.",
        args: {
            "directory": {
                "desc": "The new directory to switch to",
                "required": true
            }
        },
        parameters: "",
        execute: {
            console: function(args) {
                log("This command isn't finished yet - expect it in 3.2 or 3.3. See you soon!", logging.info, "fs")
            }
        },
        ver: "3.2.0",
        cat: "File System",
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
        alias: [],
        desc: "Shuts down the bot.",
        args: {},
        parameters: "[--disregard / --ignore-config]",
        execute: {
            discord: function(message, args, parameter) {
                if(parameter.toLowerCase() == "disregard") {
                    message.channel.send("Precipitation is now saving configuration, and then will exit.").then(m => {
                        fs.writeFile('config.json', JSON.stringify(config), function (err) {
                            if (!err) {
                                m.edit("Precipitation is now offline.").then(m => {
                                    process.exit()
                                })
                            }
                            if (err) {
                                m.edit("Precipitation will not be shut down because of a serious error while saving the configuration file.")
                            }
                        })
                    })
                    return;
                } else if(parameter.toLowerCase() == "ignore-config") ignore = true;
                if(!shutdown) {
                    shutdown = true;
                    let sdmsg = "**WARNING:** This will shut down the bot, leaving it unusable until it is turned back on! This should only be done in EXTREME circumstances, such as a serious exploit.\nIf you wish to restart the bot to update, it is better practice to perform this command through the console anyways.\n\nIf you wish to shut down the bot anyways, please execute `" + host.prefix + "shutdown` again. After 30 seconds, this message will be changed and the shutdown process will be cancelled.";
                    if(ignore) sdmsg = "**WARNING:** This will shut down the bot, leaving it unusable until it is turned back on! This should only be done in EXTREME circumstances, such as a serious exploit.\nIf you wish to restart the bot to update, it is better practice to perform this command through the console anyways.\n\n**The configuration file will not be saved - so data may not be saved.**\n\nIf you wish to shut down the bot anyways, please execute `" + host.prefix + "shutdown` again. After 30 seconds, this message will be changed and the shutdown process will be cancelled.";
                    message.channel.send(sdmsg).then(m => {
                        shutdownMessage = m;
                        setTimeout(cancelShutdown, 30000, 0);
                    })
                } else {
                    if(ignore) {
                        message.channel.send("Precipitation is now offline.").then(m => {
                            process.exit();
                        })
                    }
                    message.channel.send("Precipitation is now saving configuration, and then will exit.").then(m => {
                        fs.writeFile('config.json', JSON.stringify(config), function (err) {
                            if (!err) {
                                m.edit("Precipitation is now offline.").then(m => {
                                    process.exit()
                                })
                            }
                            if (err) {
                                cancelShutdown(1);
                                m.edit("Precipitation will not be shut down because of a serious error while saving the configuration file.")
                            }
                        })
                    })
                }
            },
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
        ver: "3.2.0",
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
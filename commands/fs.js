// file system
// console only commands

const fs = require('fs');

var commands = {
    "vd": {
        name: "vd",
        desc: "View the current directory.",
        args: "",
        parameters: "",
        execute: {
            console: function(args) {
                
            }
        },
        ver: "3.0.0",
        cat: "File System",
        prereqs: {
            dm: true,
            owner: false,
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
            owner: false,
            user: [],
            bot: []
        },
        unloadable: false
    }
}

module.exports = commands;

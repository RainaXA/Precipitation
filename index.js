'use strict' // node.js v4 compatibility
const fs = require('fs');
const readline = require('readline');
global.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

global.version = {
  name: "Vesta",
  string: "1.2.0"
}

try {
  var settings = require('./settings.json')
  if(!settings.overrides) settings.overrides = {}
} catch(err) {
  var settings = {
    overrides: {} // overrides is an object 
  }; // if this line doesn't exist then things that want to look for settings are undefined which therefore crashes forecast
}

process.stdout.write('\x1Bc'); // node.js v4 compatibility
process.title = `Forecast ${version.string} ${version.name}`;

global.sources = {
  core: "forecast",
  modules: "modules"
}

global.logging = {
  error: 91,
  warn: 93,
  info: 94,
  success: 92,
  output: 97
}

global.forecast = { // forecast functions - keep it in one object for low interference 
	version: version,
	settings: settings,
	arrays: {
		delDup: function (array) {
			array = new Set(array)
			return Array.from(array) // done this odd way to retain node.js v4 compatibility
		},
		getText: function(text, list, type) {
			switch(type) {
				case 0: // includes
					for(let i = 0; i < list.length; i++) {
					  if(text.includes(list[i])) return true;
					}
					return false;
				case 1: // exact
					for(let i = 0; i < list.length; i++) {
					  if(text == list[i]) return true;
					}
			}
			return false;
		},
		shuffle: function(array) {
			return array.sort(function(){return Math.random() - 0.5});
		}
	},
	isStr: function(value) {
		return typeof value === 'string';
	},
	require: function(file, callback) {
		file = "./modules/" + file
		try {
			let props = require(file);
			return props;
		} catch(err) {
			let error = err.stack.split("\n")[0].length + 1;
			if(!callback) return log("file " + file.slice(1) + " not found\n" + err.stack.slice(error), logging.error, sources.core);
			callback();
		}
	}
}

for(const override in settings.overrides) {
	if(isNaN(override)) settings.overrides[logging[override]] = settings.overrides[override] // set the number of a logging type as an override directly to be interpreted by log()
}

global.log = function(message, type, sender) {
  if(!type || settings.noColor) type = 97;
  if(settings.overrides[type]) type = settings.overrides[type]; // it is intended functionality that you can change the color if it is in noColor mode
  let resetColor = 0;
  if(settings.overrides['97'] && settings.noColor) resetColor = settings.overrides['97']
  if(!sender) {
    console.log("\x1b[" + type + "m" + message + "\x1b[" + resetColor + "m");
  } else {
    console.log("\x1b[" + type + "m" + sender + ": " + message + "\x1b[" + resetColor + "m");
  }
}

if(settings.doNotLogStartup != 1 && settings.doNotLogStartup != 2) log("starting", logging.success, sources.core); // this is the only way i can get this bullshit to work currently and i am impatient
if(!fs.existsSync("./settings.json")) log("settings.json does not exist. you can create it to change some basic functionality of forecast!", logging.info, sources.core)

fs.readdir("./modules/", function(error, files) {
  if (error) {
    fs.mkdirSync("./modules/");
    if(settings.doNotLogStartup != 2) log("folder not found, creating now", logging.warn, sources.modules);
  } else {
    let modules = files.filter(f => f.split(".").pop() === "js");
    let counter = 0;
    modules.forEach((f, i) => {
      try {
        let props = require(`./modules/${f}`);
		if(!props.info) {
			log(f + " does not have info (pre-1.2.0?)", logging.warn, sources.modules)
		} else {
			if(!props.info.name || !props.info.desc || !props.info.ver || !props.info.fVer) return log(f + " has an invalid info page - must contain name, desc, ver, and fVer", logging.warn, sources.modules)
			let forecastVersion = props.info.fVer;
			if (parseInt(forecastVersion.split(".")[1]) + 4 <= parseInt(version.string.split(".")[1]) && !settings.hideCompatibility) log(props.info.name + " is older module [" + forecastVersion + " module running on forecast " + version.string + "]", logging.warn, sources.modules)
			if (parseInt(forecastVersion.split(".")[1]) > parseInt(version.string.split(".")[1]) && !settings.hideCompatibility) log(props.info.name + " is newer than current forecast [" + forecastVersion + " module running on forecast " + version.string + "]", logging.warn, sources.modules)
		}
      } catch (err) {
        log(err.stack, logging.error, sources.modules);
        counter++;
      }
    })
    if(settings.doNotLogStartup != 2)  log("loaded " + (modules.length - counter) + " modules", logging.success, sources.modules);
  }
  if(settings.doNotLogStartup != 1 && settings.doNotLogStartup != 2)  log("started on version " + version.string + " " + version.name, logging.success, sources.core);
})

process.on('uncaughtException', function(err) {
	log(err, logging.error)
})
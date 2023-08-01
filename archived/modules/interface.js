const blessed = require('blessed');

global.screen = blessed.screen({
    smartCSR: true
  });
  screen.title = 'Precipitation ' + host.version.external;
  
  global.titleBox = blessed.text({
    top: "0",
    left: "0",
    width: "100%",
    height: "1",
    content: "Precipitation " + host.version.external + " " + host.version.name,
    tags: true,
    style: {
        fg: 'white',
        bg: host.color.toLowerCase()
    },
    padding: {
        left: 1
    }
  });
  screen.append(titleBox);
  
  global.logBox = blessed.log({
    top: 1,
    left: 0,
    width: "100%",
    height: "100%-4",
    tags: true,
    style: {
        fg: 'white',
        bg: 'black',
        scrollbar: {
            bg: 'white'
        }
    },
    padding: {
        left: 2
    },
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    scrollOnInput: true,
    scrollbar: {
      style: {
        bg: host.color.toLowerCase()
      }
    }
  });
  screen.append(logBox);
  
  global.textBox = blessed.textbox({
    top: "100%-2",
    left: -1,
    width: "100%+2",
    height: 3,
    tags: true,
    value: "> ",
    border: {
        type: "line"
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: 'white',
            bg: 'black'
        }
    },
    inputOnFocus: true
  });

client.on('ready', async() => {
    if(typeof currentDirectory !== 'undefined') {
        textBox.setValue(currentDirectory + ">")    
    }
})
  

  screen.append(textBox);
  textBox.focus();
  
  textBox.key('pageup', function() {
    logBox.scroll(-logBox.height);
    screen.render();
  })
  
  textBox.key('pagedown', function() {
    logBox.scroll(logBox.height);
    screen.render();
  })
  
  textBox.key('up', function() {
    logBox.scroll(-1);
    screen.render();
  })
  
  textBox.key('down', function() {
    logBox.scroll(1);
    screen.render();
  })
  
  textBox.on('submit', function() {
    let cmd = textBox.getText().slice(2)
    let thing = "> ";
    if(currentDirectory) {
      cmd = textBox.getText().slice(2 + currentDirectory.length)
      thing = currentDirectory + "> "
    }
    
    log("> " + cmd, logging.input)
    textBox.setValue(thing);
    textBox.focus();
  
    var fcCommand = cmd.split(" ")
    while(fcCommand[0] == "") {
      fcCommand.shift();
    }
    if(fcCommand[0] == undefined) return log("Sorry, but it appears this console command is unknown.", logging.info, "console") // crash otherwise
    var args = cmd.slice(fcCommand[0].length + 1)
    let command = client.commands.get(fcCommand[0].toLowerCase())
    if(command) {
      if(!command.execute.console) {
        return log("Sorry, but this command cannot be used in the console.", logging.info, "console")
      }
      command.execute.console(args);
    } else {
      log("Sorry, but it appears this console command is unknown.", logging.info, "console") // crash otherwise
    }
  })
  
  screen.render()

log = function(message, type, sender) {
  let msg;
  switch (type) {
    case logging.error:
      msg = "\x1b[91m" + sender + ": " + message
      break;
    case logging.warn:
      msg = "\x1b[93m" + sender + ": " + message
      break;
    case logging.info:
      msg = "\x1b[94m" + sender + ": " + message
      break;
    case logging.success:
      msg = "\x1b[92m" + sender + ": " + message
      break;
    case logging.output:
      msg = "\x1b[97m" + sender + ": " + message
      break;
    case logging.input:
      msg = "\x1b[37m" + message
      break;
    default:
      if(!host.developer.debugging) return;
      msg = "\x1b[95m[DEBUG] " + message
  }
  logBox.log(msg + "\x1b[0m")
}
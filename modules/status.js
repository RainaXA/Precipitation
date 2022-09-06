const host = require('../host.json');

const status = host.version.external + " " + host.version.name + " || " + host.prefix[branch] + "help"

function setStatus() {
  client.user.setActivity(status);
  setTimeout(setStatus, 60000)
}

client.on('ready', async() => { // init guilds on start
  setStatus(); // make sure playing status does not expire
})

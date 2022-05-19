# Precipitation
Probably the most controversial moderation-fun bot you will ever see

## Set up
You need node.js
Download the source
Execute `node index.js` in the terminal
Even without config, commands, or modules, the bot will create all of these automatically

## Making a command
```
module.exports.run = async (message, args, parameter) => {
    some code here
}

module.exports.help = {
    name: "(command)",
    desc: "(desc)",
    args: "",
    parameters: "",
    category: "(category)",
    version: "1.0.0"
}

```
Paste it in the file, and write your code under module.exports.run. This command should be in the commands root folder.

# Precipitation
Probably the most controversial moderation-fun bot you will ever see

## Set up
Download the source, and ensure you have node.js installed. Once you have the source installed, navigate to the bot and execute `node index.js` in the terminal. The bot is now starting.

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

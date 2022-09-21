const { MessageEmbed } = require('discord.js');

function find(query, amount) {
  let results = {};
  results.amount = 0;
  results.list = "";
  let users = client.users.cache
  if(amount == 1) { // get first user
    users.each(user => {
      if(user.tag.toLowerCase().startsWith(query)) {
        if(results.amount == undefined) return; // don't go to the last in the alphabet, dont do anything else if we've found a user.
        if(!user.bot) results = user; // prefer to ignore bots when only finding one user
      }
    })
  } else { // get a list for more than one user
    users.each(user => {
      if(user.tag.toLowerCase().startsWith(query)) {
        if(results.amount < amount) results.list += user.tag + "\n";
        results.amount++;
      }
    })
  }
  if(results.amount == 0) return null;
  return results;
}

module.exports.find = find;

module.exports.default = async (message, args, parameter) => {
  if(!args) return message.channel.send("Please input an argument.")
  let findList = find(args.toLowerCase(), 10);
  if(!findList) return message.channel.send("No results were found - please try being more lenient with your search.")
  let bottomText = host.version.external;
  if(findList.amount >= 10) {
    findList.amount -= 10;
    bottomText += " || There are " + findList.amount + " results not shown -- please narrow your query."
  }
  let embed = new MessageEmbed()
  .setTitle("Precipitation Query")
  .addFields(
    { name: "Results", value: findList.list}
  )
  .setColor(host.colors[branch])
  .setFooter({ text: 'Precipitation ' + bottomText });
  return message.channel.send({embeds: [embed]})
}

module.exports.help = {
    name: "find",
    desc: "Finds a user.",
    args: "**(user)**",
    parameters: "",
    category: "Moderation",
}

module.exports.metadata = {
    allowDM: true,
    version: "2.0.0",
    types: {
      "message": true,
      "slash": false,
      "console": false
    },
    permissions: {
      "user": [],
      "bot": []
    },
    unloadable: true
}

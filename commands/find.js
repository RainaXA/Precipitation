/* ========================================================================= *\
    Find: Precipitation command and exports to find users using a query
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

var command = {
    name: "find",
    desc: "Searches for a user using a query.",
    args: "**(query)**",
    parameters: "",
    execute: {
        discord: function(message, args) {
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
            .setColor(host.color)
            .setFooter({ text: 'Precipitation ' + bottomText });
            return message.channel.send({embeds: [embed]})
        }
    },
    ver: "3.0.0",
    cat: "Moderation",
    prereqs: {
        dm: true,
        owner: false,
        user: [],
        bot: []
    },
    unloadable: true
}

module.exports = command;
module.exports.exports = {};
module.exports.exports.find = find;
/* ========================================================================= *\
    Birthday: Precipitation command to set a birthday
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

const { SlashCommandBuilder } = require('@discordjs/builders');

function toProperUSFormat(month, day, year) {
  let wMonth;
  switch(month) {
    case 1:
      wMonth = "January";
      break;
    case 2:
      wMonth = "February";
      break;
    case 3:
      wMonth = "March";
      break;
    case 4:
      wMonth = "April";
      break;
    case 5:
      wMonth = "May";
      break;
    case 6:
      wMonth = "June";
      break;
    case 7:
      wMonth = "July";
      break;
    case 8:
      wMonth = "August";
      break;
    case 9:
      wMonth = "September";
      break;
    case 10:
      wMonth = "October";
      break;
    case 11:
      wMonth = "November";
      break;
    case 12:
      wMonth = "December";
      break;
  }
  return wMonth + " " + placeValue(day) + ", " + year;
};

function placeValue(num) {
  let number = parseInt(num)
  if(number.toString().endsWith("11") || number.toString().endsWith("12") || number.toString().endsWith("13")) {
    return number.toString() + "th";
  } else if(number.toString().endsWith("1")) {
    return number.toString() + "st";
  } else if(number.toString().endsWith("2")) {
    return number.toString() + "nd";
  } else if(number.toString().endsWith("3")) {
    return number.toString() + "rd";
  } else {
    return number.toString() + "th";
  }
}

function getDaysInMonth(month, year) {
  let leap = (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
  switch(month) {
    case 1:
      return 31;
    case 2:
      if(leap == true) {
        return 29;
      } else {
        return 28;
      }
    case 3:
      return 31;
    case 4:
      return 30;
    case 5:
      return 31;
    case 6:
      return 30;
    case 7:
      return 31;
    case 8:
      return 31;
    case 9:
      return 30;
    case 10:
      return 31;
    case 11:
      return 30;
    case 12:
      return 31;
    default:
      return "invalid month"
  }
}

var command = {
    name: "birthday",
    desc: "Sets your birthday.",
    args: {
      "birthday": {
        "desc": "What to set your birthday to in mm/dd/yyyy format",
        "required": true
      }
    },
    parameters: "",
    execute: {
        discord: function(message, args) {
          if(!config.users[message.author.id]) config.users[message.author.id] = {}
          let cmd = args.split("/");
          let year = new Date().getFullYear();
          let list = "Please:\n";
          if(!cmd[0] || !cmd[1] || !cmd[2]) {
            if(!cmd[0]) {
              list = list + "- input an argument"
            } else {
              list = list + "- separate your birthday with slashes\n"
            }
          } else {
            if(isNaN(parseInt(cmd[0])) || isNaN(parseInt(cmd[1])) || isNaN(parseInt(cmd[2]))) {
              list = list + "- only include numbers\n"
            }
            if(cmd.length != 3) {
              list = list + "- only have three numbers separated by slashes\n"
            }
            if(cmd[0].includes("-") || cmd[1].includes("-") || cmd[2].includes("-")) {
              list = list + "- remove the negative sign\n"
            }
            if(cmd[0].includes(".") || cmd[1].includes(".") || cmd[2].includes(".")) {
              list = list + "- remove the decimal\n"
            }
            if(getDaysInMonth(parseInt(cmd[0]), cmd[2]) == "invalid month") {
              list = list + "- give a valid month between 1-12\n"
            }
            if(getDaysInMonth(parseInt(cmd[0]), parseInt(cmd[2])) < parseInt(cmd[1])) {
              list = list + "- make sure the month hasn't already ended\n"
            }
            if(parseInt(cmd[2]) > year || parseInt(cmd[2]) < 1903) {
              list = list + "- ensure you input the correct birthday\n"
            }
          }
          if(list == "Please:\n") {
            message.channel.send("Okay, I will set your birthday as " + toProperUSFormat(parseInt(cmd[0]), parseInt(cmd[1]), parseInt(cmd[2])) + ".")
            if(!config.users[message.author.id].birthday) config.users[message.author.id].birthday = {}
            config.users[message.author.id].birthday.month = parseInt(cmd[0]);
            config.users[message.author.id].birthday.day = parseInt(cmd[1]);
            config.users[message.author.id].birthday.year = parseInt(cmd[2]);
          } else {
            message.channel.send(list)
          }
        },
        slash: async function (interaction) {
          let month = interaction.options.getString('month');
          let day = interaction.options.getInteger('day').toString();
          let year = interaction.options.getInteger('year').toString()
          switch(parseInt(month)) {
            case 1:
              wMonth = "January";
              break;
            case 2:
              wMonth = "February";
              break;
            case 3:
              wMonth = "March";
              break;
            case 4:
              wMonth = "April";
              break;
            case 5:
              wMonth = "May";
              break;
            case 6:
              wMonth = "June";
              break;
            case 7:
              wMonth = "July";
              break;
            case 8:
              wMonth = "August";
              break;
            case 9:
              wMonth = "September";
              break;
            case 10:
              wMonth = "October";
              break;
            case 11:
              wMonth = "November";
              break;
            case 12:
              wMonth = "December";
              break;
            }
            let currentYear = new Date().getFullYear();
            if(day.includes("-") || year.includes("-")) interaction.reply({ content: "Please remove the negative sign.", ephemeral: true })
            if(getDaysInMonth(parseInt(month), year) < day) interaction.reply({ content: "Please make sure the month hasn't already ended.", ephemeral: true })
            if(currentYear < parseInt(year) || parseInt(year) < 1903) interaction.reply({ content: "Please keep the year within a reasonable frame.", ephemeral: true })
            if(!config.users[interaction.user.id]) config.users[interaction.user.id] = {}
            if(!config.users[interaction.user.id].birthday) config.users[interaction.user.id].birthday = {}
            interaction.reply({ content: "Okay, I will set your birthday as " + toProperUSFormat(parseInt(month), parseInt(day), parseInt(year)) + "." })
            config.users[interaction.user.id].birthday.month = parseInt(month);
            config.users[interaction.user.id].birthday.day = parseInt(day);
            config.users[interaction.user.id].birthday.year = parseInt(year);
        }
    },
    ver: "3.1.0",
    cat: "Personalization",
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
module.exports.exports.toProperUSFormat = toProperUSFormat;
module.exports.data = new SlashCommandBuilder().setName(command.name).setDescription(command.desc).addStringOption(option =>
  option.setName('month')
    .setDescription('Month to be set')
    .setRequired(true)
    .addChoice("January", "1")
    .addChoice("February", "2")
    .addChoice("March", "3")
    .addChoice("April", "4")
    .addChoice("May", "5")
    .addChoice("June", "6")
    .addChoice("July", "7")
    .addChoice("August", "8")
    .addChoice("September", "9")
    .addChoice("October", "10")
    .addChoice("November", "11")
    .addChoice("December", "12"))
  .addIntegerOption(int =>
    int.setName('day')
    .setDescription("Day to be set")
    .setRequired(true))
  .addIntegerOption(int =>
    int.setName('year')
    .setDescription('Year to be set')
    .setRequired(true))
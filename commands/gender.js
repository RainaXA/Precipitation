/* ========================================================================= *\
    Gender: Precipitation command to set preferred pronouns
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
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = command;
module.exports.exports = {};
module.exports.exports.gender = function(user, mMessage, fMessage, oMessage, naMessage) {   // this function will be deprecated in 4.0
  log("gender() is a deprecated function, please use pronouns()", logging.warn, "gender");  // it remains usable to maintain backwards compatibility
  switch(config.users[user.id].gender) {                                                  
    case "male":
      return mMessage;
    case "female":
      return fMessage;
    case "other":
      return oMessage;
    default:
      return naMessage;
  }
};
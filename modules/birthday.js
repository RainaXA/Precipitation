/* ========================================================================= *\
    Birthday: module for wishing you a happy birthday in Precipitation!
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

var datesAreOnSameDay = (first, second) =>
    first.getMonth() + 1 === second.month &&
    first.getDate() === second.day;

var birthdaySent = {};

function name(user) {
  if(!config.users[user.id].name) {
    return user.username
  } else {
    return config.users[user.id].name
  }
}

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

function checkBirthdays() {
  if(!config.general) config.general = {};
  if(!config.general.bdaydoNotSend) config.general.bdaydoNotSend = [];
	client.users.cache.each(user => {
		if(config.users[user.id]) {
			if(config.users[user.id].birthday) {
        let year = "";
        if(config.users[user.id].birthday.year) year = placeValue(new Date().getFullYear() - config.users[user.id].birthday.year) + " ";
				if(datesAreOnSameDay(new Date(), config.users[user.id].birthday) && !getTextInput(user.id, config.general.bdaydoNotSend)) {
          user.send("Happy " + year + "Birthday, " + name(user) + "!\n\nI hope you have a wonderful day :)\n\nIn the future, Precipitation may give out presents for your birthday! Wouldn't that be cool?");
          config.general.bdaydoNotSend.push(user.id);
        } else if(new Date().getDate() === config.users[user.id].birthday.day + 3) { // take off the do not send birthday list if it's been 3 days since
          config.general.bdaydoNotSend.filter((n) => { return n != user.id; })
        }
			}
		}
	})
  setTimeout(checkBirthdays, 43200000)
}


client.on('ready', async() => { // init guilds on start
  checkBirthdays()
})

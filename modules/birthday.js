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
				if(datesAreOnSameDay(new Date(), config.users[user.id].birthday) && !getTextInput(user.id, config.general.bdaydoNotSend)) {
          user.send("Happy " + placeValue(new Date().getFullYear() - config.users[user.id].birthday.year) + " Birthday, " + name(user) + "!\n\nI hope you have a wonderful day :)\n\nIn the future, Precipitation may give out presents for your birthday! Wouldn't that be cool?");
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

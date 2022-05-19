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

module.exports.run = async (message, args, parameter) => {
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
    config.users[message.author.id].birthday.month = parseInt(cmd[0]);
    config.users[message.author.id].birthday.day = parseInt(cmd[1]);
    config.users[message.author.id].birthday.year = parseInt(cmd[2]);
  } else {
    message.channel.send(list)
  }
}

module.exports.help = {
    name: "birthday",
    desc: "Sets your birthday.",
    args: "**(mm/dd/yyyy)**",
    parameters: "",
    category: "Personalization",
    version: "1.0.0"
}

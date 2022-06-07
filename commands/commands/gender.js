global.gender = function(user, mMessage, fMessage, oMessage, naMessage) { // male first, female second, others third
  if(mMessage && fMessage && oMessage) {
    if(naMessage) {
      if(config.users[user.id].gender == "male") return mMessage;
      if(config.users[user.id].gender == "female") return fMessage;
      if(config.users[user.id].gender == "other") return oMessage;
      if(!config.users[user.id].gender) return naMessage;
    } else {
      if(config.users[user.id].gender == "male") return mMessage;
      if(config.users[user.id].gender == "female") return fMessage;
      if(!config.users[user.id].gender || config.users[user.id].gender == "other") return oMessage;
    }
  } else {
    if(config.users[user.id].gender) {
      return config.users[user.id].gender
    } else {
      return "other";
    }
  }
}

module.exports.run = async (message, args, parameter) => {
  let cmdGender;
        switch(args) {
          case "female":
          case "she/her":
          case "f":
            cmdGender = "female";
            break;
          case "male":
          case "he/him":
          case "m":
            cmdGender = "male";
            break;
          case "other":
          case "they/them":
          case "o":
            cmdGender = "other";
            break;
          default:
            cmdGender = "n/a"
        }
        if (cmdGender == "n/a") {
          cmdGender = "other";
          message.channel.send("I'll just set your gender to **other**. If you'd rather not be, please use \"female\" or \"male.\"")
        } else {
          message.channel.send("Sure thing, I'll refer to you as **" + cmdGender + "**.")
        }
        config.users[message.author.id].gender = cmdGender;
}

module.exports.help = {
    name: "gender",
    desc: "Sets the gender for the bot to refer to you as.",
    args: "(male / female / other)",
    parameters: "",
    category: "Personalization",
    version: "1.0.0"
}

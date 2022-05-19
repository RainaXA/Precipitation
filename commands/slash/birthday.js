const { SlashCommandBuilder } = require('@discordjs/builders');

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Sets your birthmonth. (use mm/dd/yyyy in pr:birthday)')
        .addStringOption(option =>
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
          .setRequired(true)),
    async execute(interaction) {
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
        interaction.reply({ content: "Okay, I will set your birthday as " + toProperUSFormat(parseInt(month), parseInt(day), parseInt(year)) + "." })
        config.users[interaction.user.id].birthday.month = parseInt(month);
        config.users[interaction.user.id].birthday.day = parseInt(day);
        config.users[interaction.user.id].birthday.year = parseInt(year);
    }
};

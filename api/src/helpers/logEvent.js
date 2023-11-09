const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

const fileName = path.join(__dirname, "../../logs", "logs.log");

const logEvents = async (msg) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy\tss:mm:HH")}`;
  const contentLog = `${dateTime}-------${msg}\n`;

  try {
    fs.appendFile(fileName, contentLog, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;

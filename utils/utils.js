const fs = require("fs");

const writeToJsonFile = (filename, content) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(content));
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = { writeToJsonFile };

const mongoose = require("mongoose");

const makeConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("🚀The app is connected to the database...");
  } catch (err) {
    console.log("Error connecting to the database: " + err.message);
  }
};

module.exports = {
  makeConnection,
};

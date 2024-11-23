const mongoose = require("mongoose");

const makeConnection = async () => {
  try {
        await mongoose
            .connect(process.env.string);
        console.log("The app is connected to the database...");
    } catch (err) {
        console.log("Error: " + err.message);
    }
};

module.exports = {
    makeConnection
}


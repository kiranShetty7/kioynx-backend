const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const URI = process.env.URI;

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(URI, { dbName: "Kionyx" });
    console.log(`Connected to DB on ${connection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1);
  }
};

module.exports = connectToDB;

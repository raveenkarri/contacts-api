const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database host:", connect.connection.name);
  } catch (Err) {
    console.log(Err);
    process.exit(1);
  }
};
module.exports = dbConnection;

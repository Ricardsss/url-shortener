const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : "mongodb://localhost/urlShortener";

mongoose.Promise = global.Promise;

function connectDB() {
  console.log("Connecting to database...");
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB.");
  mongoose.connection.on("error", (error) => {
    console.log("Error connecting to database.");
    console.log(error);
  });
}

module.exports = connectDB;

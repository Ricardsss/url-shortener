require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./database/mongoose");
const authRouter = require("./routes/auth");

const PORT = process.env.PORT ? process.env.PORT : "3000";
const MONGO_URI = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : "mongodb://localhost/urlShortener";

const app = express();

const registerHooks = () => {
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: MONGO_URI }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

const registerRoutes = () => {
  app.use("/auth", authRouter);
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });
};

const start = async () => {
  registerHooks();
  registerRoutes();
  connectDB();
  startServer();
};

start();

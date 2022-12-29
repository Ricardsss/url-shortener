require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require("./database/mongoose");
const authRouter = require("./routes/auth");
const urlRouter = require("./routes/url");

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
      rolling: true,
      store: MongoStore.create({ mongoUrl: MONGO_URI }),
      cookie: {
        expires: 1800000,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

const registerRoutes = () => {
  app.use("/auth", authRouter);
  app.use("/", urlRouter);
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

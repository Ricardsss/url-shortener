const emailValidator = require("email-validator");
const validUrl = require("valid-url");
const User = require("../database/models/user.model");
const URL = require("../database/models/url.model");

const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : "http://localhost:8080";

const middleware = {
  auth: {
    checkAuthenticated: async (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.status(401).send("You must be signed in to access this resource.");
      }
    },
    checkLoggedIn: async (req, res, next) => {
      if (!req.isAuthenticated()) {
        next();
      } else {
        res.status(400).send("A user is already logged in.");
      }
    },
    checkEmail: async (req, res, next) => {
      const { email } = req.body;
      if (emailValidator.validate(email)) {
        next();
      } else {
        res.status(400).send(`${email} is an invalid email.`);
      }
    },
    checkUser: async (req, res, next) => {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        next();
      } else {
        res.status(400).send(`A user with the email ${email} already exists.`);
      }
    },
  },
  url: {
    checkURL: async (req, res, next) => {
      const { originalURL } = req.body;
      if (validUrl.isUri(originalURL)) {
        next();
      } else {
        res.status(400).send(`${originalURL} is not a valid URL.`);
      }
    },
    urlExists: async (req, res, next) => {
      const { code } = req.params;
      const url = await URL.findById(code);
      if (url) {
        req.url = url;
        next();
      } else {
        res.status(400).send(`${BASE_URL}/${code} does not exist.`);
      }
    },
    urlStillValid: async (req, res, next) => {
      const url = req.url;
      if (url.expirationDate > Date.now()) {
        next();
      } else {
        res.status(400).send(`${BASE_URL}/${code} has expired.`);
      }
    },
    ownsURL: async (req, res, next) => {
      const { code } = req.params;
      const userId = req.user.id;
      const url = req.url;
      if (url._userId == userId) {
        next();
      } else {
        res
          .status(403)
          .send(`${BASE_URL}/${code} does not belong to the signed in user.`);
      }
    },
  },
};

module.exports = middleware;

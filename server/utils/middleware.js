const emailValidator = require("email-validator");
const validUrl = require("valid-url");

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
  },
};

module.exports = middleware;

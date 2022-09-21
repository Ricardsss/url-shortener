const { nanoid } = require("nanoid");
const URL = require("../database/models/url.model");

const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : "http://localhost:8080";

const urlController = {
  createURL: async (req, res) => {
    await req.session.touch();
    const { originalURL, customCode, expirationDate } = req.body;
    const userId = req.user.id;
    try {
      const urlCode = customCode ? customCode : nanoid(8);
      const url = new URL({
        _id: urlCode,
        originalURL: originalURL,
        _userId: userId,
      });
      if (expirationDate) {
        const date = new Date(expirationDate);
        url.expirationDate = date;
      }
      await url.save();
      res.send({ shortenedUrl: `${BASE_URL}/${urlCode}` });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send("The selected short link already exists.");
      } else {
        res.status(500).send(`Server error: ${error}`);
      }
    }
  },
  goToUrl: async (req, res) => {
    const url = req.url;
    try {
      res.redirect(url.originalURL);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Server error: ${error}`);
    }
  },
  deleteURL: async (req, res) => {
    await req.session.touch();
    const url = req.url;
    try {
      await url.delete();
      req.url = null;
      res.send(`${BASE_URL}/${url._id} has been deleted.`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(`Server error: ${error}`);
    }
  },
};

module.exports = urlController;

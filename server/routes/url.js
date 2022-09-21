const express = require("express");
const urlController = require("../controllers/url.controller");
const middleware = require("../utils/middleware");

const router = express.Router();

router.post(
  "/",
  [middleware.auth.checkAuthenticated, middleware.url.checkURL],
  urlController.createURL
);

router.get("/:code", urlController.goToUrl);

module.exports = router;

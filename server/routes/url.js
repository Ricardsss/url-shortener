const express = require("express");
const urlController = require("../controllers/url.controller");
const middleware = require("../utils/middleware");

const router = express.Router();

/**
 * Purpose: Create a new shortened URL
 * @route POST /
 * @group URLs
 * @param {String} originalURL.body.required - URL to be shortened
 * @param {String} customCode.body - Custom URL code for shortened URL
 * @param {Date} expirationDate.body - Expiration date for shortened URL
 * @returns {Object} 200 - New shortened url
 * @return 500 - Server error
 */
router.post(
  "/",
  [middleware.auth.checkAuthenticated, middleware.url.checkURL],
  urlController.createURL
);

/**
 * Purpose: Access the original URL via the shortened URL code
 * @route GET /{code}
 * @group URLs
 * @param {String} code.path - Code of URL to be accessed
 * @redirects 200 - To the location of original URL
 * @return 500 - Server error
 */
router.get(
  "/:code",
  [middleware.url.urlExists, middleware.url.urlStillValid],
  urlController.goToUrl
);

/**
 * Purpose: Delete a shortened URL
 * @route DELETE /{code}
 * @group URLs
 * @param {String} code.path - Code of URL to be deleted
 * @returns {String} 200 - URL that has been deleted
 * @return 500 - Server error
 */
router.delete(
  "/:code",
  [
    middleware.auth.checkAuthenticated,
    middleware.url.urlExists,
    middleware.url.ownsURL,
  ],
  urlController.deleteURL
);

module.exports = router;

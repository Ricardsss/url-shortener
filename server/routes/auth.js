const express = require("express");
const authController = require("../controllers/auth.controller");
const middleware = require("../utils/middleware");

const router = express.Router();

/**
 * Purpose: Register a new user
 * @route POST /register
 * @group Users
 * @param {String} firstName.body.required - First name of the new user
 * @param {String} lastName.body.required - Last name of the new user
 * @param {String} email.body.required - Email address of the new user
 * @param {String} password.body.required - Password of the new user
 * @returns {String} 200 - Successful sign in message
 * @return 500 - Server error
 */
router.post(
  "/register",
  [middleware.auth.checkEmail, middleware.auth.checkUser],
  authController.register
);

/**
 * Purpose: Log in a user
 * @route POST /login
 * @group Users
 * @param {String} email.body.required - Email address of the user
 * @param {String} password.body.required - Password of the user
 * @returns {String} 200 - Successful sign in message
 * @return 500 - Server error
 */
router.post(
  "/login",
  [middleware.auth.checkLoggedIn, middleware.auth.checkEmail],
  authController.logIn
);

/**
 * Purpose: Log out a user
 * @route POST /login
 * @group Users
 * @returns {String} 200 - Successful sign out message
 * @return 500 - Server error
 */
router.delete(
  "/logout",
  middleware.auth.checkAuthenticated,
  authController.logout
);

module.exports = router;

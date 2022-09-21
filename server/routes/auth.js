const express = require("express");
const authController = require("../controllers/auth.controller");
const middleware = require("../utils/middleware");

const router = express.Router();

router.post("/register", middleware.auth.checkEmail, authController.register);

router.post(
  "/login",
  [middleware.auth.checkLoggedIn, middleware.auth.checkEmail],
  authController.logIn
);

router.delete(
  "/logout",
  middleware.auth.checkAuthenticated,
  authController.logout
);

module.exports = router;

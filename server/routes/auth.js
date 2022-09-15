const express = require("express");
const authController = require("../controllers/auth.controller");
const middleware = require("../utils/middleware");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", middleware.checkLoggedIn, authController.logIn);

router.delete("/logout", middleware.checkAuthenticated, authController.logout);

module.exports = router;

const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");

passport.use(authController.localStrategy);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, email: user.email });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", passport.authenticate("local"), (req, res) => {
  return res.send("Logged in successfully.");
});

router.delete("/logout", authController.logout);

module.exports = router;

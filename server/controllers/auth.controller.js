const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../database/models/user.model");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, {
          message: `User with email ${email} does not exist.`,
        });
      } else {
        bcrypt.compare(
          password,
          user.hashedPassword,
          async (error, isPasswordMatch) => {
            if (error) {
              return done(error);
            } else if (!isPasswordMatch) {
              return done(null, false, {
                message: `Incorrect password for user with email ${email}.`,
              });
            } else {
              user.lastLogin = Date.now();
              await user.save();
              return done(null, user);
            }
          }
        );
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user._id, email: user.email });
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

const authController = {
  register: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return res.status(500).send(`Server error: ${error}.`);
      }
      bcrypt.hash(password, salt, async (error, hashedPassword) => {
        if (error) {
          return res.status(500).send(`Server error: ${error}.`);
        }
        const user = new User({
          firstName,
          lastName,
          email,
          hashedPassword,
        });
        await user.save();
        req.logIn(user, (error) => {
          if (error) {
            return res.status(500).send(`Server error: ${error}.`);
          }
          res.send(`Logged in user with email ${email} successfully.`);
        });
      });
    });
  },
  logIn: async (req, res) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) {
        res.status(500).send(`Server error: ${error}`);
      } else if (!user) {
        res.status(400).send(info.message);
      } else {
        req.logIn(user, (error) => {
          if (error) {
            res.status(500).send(`Server error: ${error}`);
          } else {
            res.send(`Logged in user with email ${user.email} successfully.`);
          }
        });
      }
    })(req, res);
  },
  logout: async (req, res) => {
    req.logout((error) => {
      if (error) {
        return res.status(500).send(`Server error: ${error}`);
      } else {
        res.send("Logged out successfully.");
      }
    });
  },
};

module.exports = authController;

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
          (error, isPasswordMatch) => {
            if (error) {
              return done(error);
            } else if (!isPasswordMatch) {
              return done(null, false, {
                message: `Incorrect password for user with email ${email}.`,
              });
            } else {
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
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      bcrypt.genSalt(10, (error, salt) => {
        if (error) {
          return res.status(500).send("Server error.");
        }
        bcrypt.hash(password, salt, async (error, hashedPassword) => {
          if (error) {
            return res.status(500).send("Server error.");
          }
          const user = new User({
            name: name,
            email: email,
            hashedPassword: hashedPassword,
          });
          await user.save();
          const newUser = { id: user._id, email: user.email };
          req.logIn(newUser, (error) => {
            if (error) {
              return res.status(500).send("Server error.");
            }
            res.send("Logged in successfully.");
          });
        });
      });
    } else {
      res.status(400).send(`A user with the email ${email} already exists.`);
    }
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
        return res.status(500).send("Server error.");
      } else {
        res.send("Logged out successfully.");
      }
    });
  },
};

module.exports = authController;

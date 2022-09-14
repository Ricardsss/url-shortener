const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../database/models/user.model");

const authController = {
  localStrategy: new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, {
          message: "Incorrect email or password.",
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
                message: "Incorrect email or password.",
              });
            } else {
              return done(null, user);
            }
          }
        );
      }
    }
  ),
  register: async (req, res, next) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return next(error);
      }
      bcrypt.hash(req.body.password, salt, async (error, hashedPassword) => {
        if (error) {
          return next(error);
        }
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          hashedPassword: hashedPassword,
        });
        await user.save();
        const newUser = { id: user._id, email: user.email };
        req.logIn(newUser, (error) => {
          if (error) {
            return next(error);
          }
          res.send("Logged in successfully.");
        });
      });
    });
  },
  logout: async (req, res, next) => {
    console.log(req.user);
    req.logout((error) => {
      if (error) {
        return next(error);
      } else {
        res.send("Logged out successfully.");
      }
    });
  },
};

module.exports = authController;

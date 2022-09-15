const middleware = {
  checkAuthenticated: async (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(400).send("You must be signed in to access this resource.");
    }
  },
  checkLoggedIn: async (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(400).send("A user is already logged in.");
    }
  },
};

module.exports = middleware;

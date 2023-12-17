const passport = require("passport");

module.exports = {
  initialize: function () {
    return passport.initialize();
  },
  authenticate_user: function (req, res, next) {
    return passport.authenticate(
      "user",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) return res.status(401).json({message:"Something went wrong"});
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
      }
    )(req, res, next);
  },
};
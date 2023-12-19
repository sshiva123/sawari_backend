const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/user");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use("user",
  new StrategyJwt(options, async (jwtPayload, done) => {
    return User.findById(jwtPayload._id)
      .select("-password -accountType")
      .then((user) => {
        if (user.accountType === "user") {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((error) => {
        return done(error);
      });
  })
);
passport.use("admin",
  new StrategyJwt(options, async (jwtPayload, done) => {
    return User.findById(jwtPayload._id)
      .select("-password -accountType")
      .then((user) => {
        if (user.accountType === "admin") {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((error) => {
        return done(error);
      });
  })
);
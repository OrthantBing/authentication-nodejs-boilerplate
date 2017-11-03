const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Set up options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

const localOptions = {
  usernameField: "email"
};
// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return done(null, false);
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (done) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

// Tell passport to use the strategy

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config");

function tokenForUser(user) {
  return jwt.sign({ sub: user.id, iat: new Date().getTime() }, config.secret);
}

exports.signin = function(req, res, next) {
  //passport magically assigns req.user
  //because we passed it in the done callback.
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      error: {
        name: "ValidationError",
        message: "Must provide email and password"
      }
    });
  }
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(422).send({
        error: {
          name: "Validation Failed",
          message: "Email already in user"
        }
      });
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(err => {
      if (err) {
        return next(err);
      }

      res.json({ token: tokenForUser(user) });
    });
  });
};

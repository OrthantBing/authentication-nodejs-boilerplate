const Authentication = require("./controllers/authentication");

// passportService is the one without exports.
// Its more of execute something.

const passportService = require("./services/passport");

const passport = require("passport");
console.log(passport);

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  app.get("/", requireAuth, function(req, res) {
    res.send({ hi: "there" });
  });
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/signup", Authentication.signup);
};

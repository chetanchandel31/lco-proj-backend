const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const user = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 422 error: server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
    return res.status(422).json({ error: errors.array()[0]?.msg });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "not able to save user in db" });
    }

    res.json(user);
  });
};

exports.signin = (req, res) => {
  // check memories app signin too
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0]?.msg });
  }

  // can't return properly to end this function this way
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "incorrect password" });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to front-end
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token"); // clear cookie from user's browser
  res.json({ message: "user signed out successfully" });
};

// protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// custom middleware
exports.isAuthenticated = (req, res, next) => {
  // req.auth comes from express validator and req.profile comes from getUserById (middleware running before all user routes)
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  // id extracted from user's auth token should be same as id coming from req.params(i.e. "/:userId")

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    // ideally should check user's role from db instead of what's coming from FE
    return res.status(403).json({
      error: "You are not admin, access denied",
    });
  }

  next();
};

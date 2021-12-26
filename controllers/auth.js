const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const user = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 422 error: server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
    return res.status(422).json({ errors: errors.array() });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ err: "not able to save user in db" });
    }

    res.json(user);
  });
};

exports.signin = (req, res) => {
  // check memories app signin too
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // can't return properly to end this function this way
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password don't match" });
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
  res.clearCookie("token");
  res.json({ message: "user signed out successfully" });
};

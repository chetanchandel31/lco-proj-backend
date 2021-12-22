const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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

exports.signout = (req, res) => {
  res.json({ message: "user signout.." });
};

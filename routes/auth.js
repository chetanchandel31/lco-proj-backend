const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  body("name")
    .isLength({ min: 3 })
    .withMessage("name must be atleast 3 characters"),
  body("email").isEmail().withMessage("invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password should be of atleast 6 characters"),
  signup
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password should be of atleast 6 characters"),
  signin
);

router.get("/signout", signout);

// protected route
router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;

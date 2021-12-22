const { signout, signup } = require("../controllers/auth");
const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  body("name")
    .isLength({ min: 3 })
    .withMessage("name must be atleast 3 characters"),
  body("email").isEmail().withMessage("invalid email"),
  signup
);
router.get("/signout", signout);

module.exports = router;

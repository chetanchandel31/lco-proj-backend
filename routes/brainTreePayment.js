const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/brainTreePayment");
const { getUserById } = require("../controllers/user");

const router = express.Router();

router.param("userId", getUserById);

router.get("/payment/braintree/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;

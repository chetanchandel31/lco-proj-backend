const express = require("express");
const { makePayment } = require("../controllers/stripePayment");

const router = express.Router();

router.post("/stripe-payment", makePayment);

module.exports = router;

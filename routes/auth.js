const { signout } = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.get("/signout", signout);

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById); // middleware to populate req.profile with User found in db

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.put(
  "/user/orders/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;

const express = require("express");
const {
  loginUser,
  signUpUser,
  logoutUser,
  
  getUserId,
} = require("../Controllers/userAuthController");
const tokenVerify = require("../Middlewares/tokenVerify");
const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signUpUser);

// verify token
router.get("/verify-token", tokenVerify, (req, res) => {});

// logout route
router.post("/logout", logoutUser);

// forgot password
// router.post("/forgot-password", forgotPassword);

module.exports = router;

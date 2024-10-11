const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const googleAuth = express.Router();
const jwtSecret = "mysecrettoken";

// set autentication method - Gogle + email
googleAuth.get(
  "/",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

// Handle result of authentication
googleAuth.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    failureMessage: true,
    // successRedirect: '/',
    session: true,
  }),
  (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Google OAuth authentication fails" });
    }

    console.log("Google OAuth authentication is successful!",req.user);

    const payload = {
      user: {
        id: req.user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token, id: req.user.id});
    });

    // return res.status(200).json({ data: req.user.id });
  }
);

module.exports = googleAuth;

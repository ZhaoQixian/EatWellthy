const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const googleAuth = express.Router();
const jwtSecret = "mysecrettoken";

const User = require("../models/User");

// set autentication method - Gogle + email
googleAuth.get(
  "/",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

googleAuth.get("/success", async (req, res) => {
  if (req.user) {
    // console.log("Google INFO", req.user);
    // console.log("ID : ", req.user.id);
    // console.log("Name : ", "Google User (" + req.user.emails[0].value + ")");
    // console.log("Email : ", req.user.emails[0].value);
    // console.log("Avatar : ", req.user.photos[0].value);
    // console.log("Date : ", null);

    // Extract the email and handle the name formatting
    const email = req.user.emails[0].value;
    let userName = email.includes("@gmail.com")
      ? email.split("@gmail.com")[0]
      : email.split("@")[0];

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (!user) {
        // If user doesn't exist, create a new user
        user = new User({
          name: userName, // Set name based on email formatting rule
          email,
          password: "google_oauth_user", // Default password for Google users
          avatar: req.user.photos[0].value || null,
          isVerified: true, // Mark Google-authenticated users as verified
          date: null,
        });

        await user.save();
      }

      // Generate JWT token
      const payload = { user: { id: user.id } };
      jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        return res.status(200).json({ success: true, token, user });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  } else {
    return res.status(400).json({ error: "no Google log in" });
  }
});

googleAuth.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

googleAuth.get("/logout", async (req, res) => {
  await req.logout();
  // res.clearCookie("session", { path: "/", httpOnly: true });
  // res.clearCookie("session.sig", { path: "/", httpOnly: true });
  // req.sessionOptions.maxAge = 0;
  return res.status(200).json({ message: "logout is done" });
});

// Handle result of authentication
googleAuth.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "http://localhost:3000/login",
    session: true,
  })
);

module.exports = googleAuth;

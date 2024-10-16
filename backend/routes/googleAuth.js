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

googleAuth.get("/success", (req, res) => {
  if (req.user) {
    // console.log("Google INFO", req.user);
    // console.log("ID : ", req.user.id);
    // console.log("Name : ", "Google User (" + req.user.emails[0].value + ")");
    // console.log("Email : ", req.user.emails[0].value);
    // console.log("Avatar : ", req.user.photos[0].value);
    // console.log("Date : ", null);

    const payload = {
      user: {
        id: req.user.id,
      },
    };
    const user = {
      id: req.user.id,
      name: "Google User (" + req.user.emails[0].value + ")",
      email: req.user.emails[0].value,
      avatar: req.user.photos[0].value || null,
      date: null,
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ success: true, token, user });
    });
  } else return res.status(400).json({ error: "no Google log in" });
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

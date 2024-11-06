const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const fs = require("fs");
let multer = require("multer");
let uuidv4 = require("uuid");
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
} = require("../utils/emailUtil");

var jwtSecret = "mysecrettoken";

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate a strong temporary password
const generateTemporaryPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};
// @route   POST /users/forgot-password
// @desc    Generate a new password and send via email
// @access  Public
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ errors: [{ msg: "User not found" }] });
      }

      // Generate a temporary new password
      const temporaryPassword = generateTemporaryPassword();

      // Hash the temporary password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      // Send the new password via email
      const emailSent = await sendForgotPasswordEmail(email, temporaryPassword);

      if (!emailSent) {
        return res
          .status(500)
          .json({ msg: "Failed to send the email. Please try again later." });
      }

      res.json({ msg: "A new password has been sent to your email" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT /users/update-name
// @desc    Update user's name
// @access  Private
router.put(
  "/update-name",
  auth,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.name = req.body.name;
      await user.save();

      const userResponse = await User.findById(req.user.id).select("-password");
      res.json(userResponse);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000;

      user = new User({
        name,
        email,
        password,
        verificationCode,
        verificationCodeExpires,
        isVerified: false,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      await sendVerificationEmail(email, verificationCode);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          msg: "Registration successful! Please check your email for the verification code.",
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /users/verify-code
// @desc    Verify email with code
// @access  Public
router.post(
  "/verify-code",
  [
    check("email", "Email is required").isEmail(),
    check("code", "Verification code is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;

    try {
      const user = await User.findOne({
        email,
        verificationCode: code,
        verificationCodeExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid or expired verification code" }],
        });
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      res.json({ msg: "Email verified successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /users/auth
// @desc    Get user by token/ Loading user
// @access  Private
router.get("/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /users/auth
// @desc    Authentication user & get token/ Login user
// @access  Public
router.post(
  "/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          errors: [{ msg: "Please verify your email before logging in" }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST /users/resend-verification
// @desc    Resend verification code
// @access  Public
router.post(
  "/resend-verification",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User not found" }] });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already verified" }] });
      }

      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000;

      await user.save();
      await sendVerificationEmail(email, verificationCode);

      res.json({ msg: "New verification code sent" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//Upload File
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

//@route   POST /users/uploadfile
//@desc    Avatar Upload File
//@access  Public
router.post(
  "/uploadfile",
  auth,
  [upload.single("avatar")],
  async (req, res) => {
    try {
      const url = req.protocol + "://" + req.get("host");

      const user = await User.findOne({ _id: req.user.id });

      const deletepicture = user.avatar.split("/");
      try {
        fs.unlinkSync("public/" + deletepicture[4]);
      } catch (err) {
        console.log(err);
      }
      const response = await User.update(
        { _id: req.user.id },
        {
          $set: {
            avatar: url + "/public/" + req.file.filename,
          },
        }
      );
      console.log(response);
      return res.status(200).send();
    } catch (err) {
      console.error(err.message);
      return res.status(500).send(message.SERVER_ERROR);
    }
  }
);

// @route   PUT /users/updatepassword
// @desc    Update password
// @access  Private
router.put(
  "/updatepassword",
  auth,
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
      const userId = req.user.id;
      console.log("User ID from token:", userId);

      let user = await User.findById(userId);

      if (!user) {
        console.log("User not found");
        return res.status(404).json({ msg: "User not found" });
      }

      console.log("User found:", user.email);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("Hashed password:", hashedPassword);

      user.password = hashedPassword;

      await user.save();
      console.log("Password updated successfully");

      res.json({ msg: "Password updated successfully" });
    } catch (err) {
      console.log(err);
      console.error("Error while updating password:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE /users/delete
// @desc    Delete user
// @access  Private
router.delete("/delete", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

const dotenv = require("dotenv");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path"); // Ensure path is required
const passport = require("passport");
const cookieSession = require("cookie-session");
const { Strategy } = require("passport-google-oauth20");

const passportSetup = require("./passport/passportConfig");
const auth = require("./routes/Auth");
const googleAuth = require("./routes/googleAuth");
const locationRouter = require("./routes/location");
const eventRoute = require("./routes/eventRoute");
const nutrition = require("./routes/Nutrition");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5050;

const app = express();

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);

// Use passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Body parser middleware (using express.json and express.urlencoded directly)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies to be sent in cross-origin requests
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use CORS with options
app.use(cors(corsOptions));

//for temporary testing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Basic route
app.use("/users/google", googleAuth);
app.use("/users", auth);
app.use("/location", locationRouter);
app.use("/api/supermarkets", require("./routes/supermarkets"));
app.use("/nutrition/", nutrition);
app.use("/events", eventRoute);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set Static Folder
  app.use(express.static("mern-auth/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "mern-auth", "build", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

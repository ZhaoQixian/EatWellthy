const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const passport = require("passport");
const cookieSession = require("cookie-session");

const passportSetup = require("./passport/passportConfig");
const auth = require("./routes/Auth");
const googleAuth = require("./routes/googleAuth");
const locationRouter = require("./routes/location");
const nutrition = require("./routes/Nutrition");
const scrapeRoutes = require("./routes/scrapeRoutes");
const wellohRountes = require("./routes/wellohAI");

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

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", //frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Use CORS
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/users/google", googleAuth);
app.use("/users", auth);
app.use("/location", locationRouter);
app.use("/nutrition/", nutrition);
app.use("/api/scrape", scrapeRoutes);
app.use("/welloh",wellohRountes);
app.use("/api/profile", require("./routes/profile")); // Import the new route

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
  app.use(express.static("mern-auth/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "mern-auth", "build", "index.html"));
  });
}
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

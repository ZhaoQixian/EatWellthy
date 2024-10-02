const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./routes/Auth");
const favicon = require("serve-favicon");
const path = require("path"); // Ensure path is required

// Load environment variables
dotenv.config();

const app = express();

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

// Basic route
app.use("/users", auth);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
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
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

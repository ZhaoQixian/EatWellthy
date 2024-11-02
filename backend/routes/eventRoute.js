const router = require("express").Router();
const Event = require("../models/Event");

//for google calendar integration
const { google } = require("googleapis");

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://accounts.google.com/o/oauth2/auth" // replace with your redirect URI
);

// Scopes for Google Calendar
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
// Helper function to create a Google Calendar event

async function createGoogleCalendarEvent(event) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const eventStartTime = new Date(event.start);
  const eventEndTime = new Date(event.end);

  const calendarEvent = {
    summary: event.title,
    description: event.describe,
    start: {
      dateTime: eventStartTime.toISOString(),
      timeZone: "Asia/Singapore", // Update time zone as necessary
    },
    end: {
      dateTime: eventEndTime.toISOString(),
      timeZone: "Asia/Singapore", // Update time zone as necessary
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: calendarEvent,
    });
    return response.data; // Return the created event details
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error; // Propagate the error for handling in the route
  }
}

// Route to create a new event
router.post("/", async (req, res) => {
  const hashedUserId = Event.hashedUserId(req.body.userId);
  const newBody = { ...req.body, userId: hashedUserId };

  const newEvent = new Event(newBody);

  try {
    // Save event to the database
    const savedEvent = await newEvent.save();

    // Create Google Calendar event
    const googleEvent = await createGoogleCalendarEvent(savedEvent);

    return res.status(200).json({
      success: true,
      data: savedEvent,
      message: "Event is added",
      googleCalendarEventId: googleEvent.id, // Optionally return the Google Calendar event ID
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).json({ success: false, error: err });
  }
});

router.get("/", async (req, res) => {
  const user = req.query;
  const hashedUserId = Event.hashedUserId(user.id);

  const events = await Event.find({});
  const filteredEvents = events.filter((event) => event.userId == hashedUserId);
  // console.log("ID : ", user.id);
  // console.log("FilteredEvent : ", filteredEvents);

  try {
    res.status(200).json(filteredEvents);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).json({ success: false, error: err });
  }
});

router.get("/:id/show", async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id);

  try {
    res.status(200).json(event);
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Event is not found" });
  }
});

router.put("/:id/update", async (req, res) => {
  const id = req.params.id;
  console.log("ID: ", id);
  console.log(req.body);
  const updateQuery = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    describe: req.body.describe,
  };
  try {
    const result = await Event.findOneAndUpdate({ _id: id }, updateQuery);
    console.log("event found", result);
    return res
      .status(200)
      .json({ sucess: true, data: result, message: "event is updated" });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ success: false, message: "event is not updated" });
  }
});

router.delete("/:id/delete", async (req, res) => {
  const id = req.params.id;
  console.log("DELETE ID : ", id);
  try {
    const found = await Event.findById(id);
    console.log("FOUND : ", found);
    if (found) {
      const result = await Event.findByIdAndDelete(id);
      console.log("DELETE result:", result);
      res.status(200).json({ sucess: true, message: "Event is delete" });
    }
  } catch (err) {
    console.log({ sucess: false, message: "Event is not delete" });
  }
});

module.exports = router;

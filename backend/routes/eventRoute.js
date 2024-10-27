const router = require("express").Router();
const Event = require("../models/Event");
const handleError = require("../middlewares/eventErrors");

//for google calendar integration
const { google } = require("googleapis");

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "/calendar" // replace with your redirect URI
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
    return response.data;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}

// Route to create a new event
router.post("/", async (req, res) => {
  const newEvent = new Event(req.body);

  try {
    // Save event to the database
    const savedEvent = await newEvent.save();

    // Create Google Calendar event
    const googleEvent = await createGoogleCalendarEvent(savedEvent);

    return res.status(200).json({
      success: true,
      data: savedEvent,
      googleCalendarEventId: googleEvent.id,
    });
  } catch (err) {
    console.error("Error:", err);
    handleError(err, res);
  }
});

router.get("/", async (req, res) => {
  const events = await Event.find({});

  try {
    res.status(200).json(events);
  } catch (err) {
    handleError(err, res);
  }
});

router.get("/:id/show", async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id);

  try {
    res.status(200).json(event);
  } catch (err) {
    handleError(err, res);
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const newEvent = await new Event(req.body);
  console.log(newEvent);
  try {
    const data = await newEvent.save();
    console.log(data);
    return res.status(200).json({ sucess: true, data });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err });
  }

  // try {
  //   await newEvent.save((err, event) => {
  //     if (err) {
  //       handleError(err, res);
  //     } else {
  //       res.status(200).json(event);
  //     }
  //   });
  // } catch (err) {
  //   handleError(err, res);
  // }
});

router.put("/:id/update", async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findOne({ _id: id });
    if (event) {
      Object.assign(event, req.body);
      event.save((err, event) => {
        if (err) {
          handleError(err, res);
        } else {
          res.status(200).json(event);
        }
      });
    }
    if (!event) {
      res.status(404).json({ error: "event is not found" });
    }
  } catch (err) {
    console.log(err);
    handleError(err, res);
  }

  //   const result = await Event.findOneAndUpdate(req.params.id,
  //         {
  //         $set: req.body,
  //     }
  //     , {new: true, runValidators: true}).clone()

  //     try{
  //         res.status(200).json(result)
  //     }catch(err){
  //         // res.status(500).json(Object.keys(result.errors)[0])
  //         console.log(err)
  //         res.status(400).json(err)
  //     }
  // .then((docs, err)=>{
  //     if(docs){
  //         res.status(200).json(docs)
  //     }else{
  //         console.log(err.errors.path)
  //         handleError(err, res)
  //     }
  // })
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
      res.status(200).json("Event has been deleted");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

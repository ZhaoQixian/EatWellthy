import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Popping from "./Popping";
import { getEvent, getAllEvents } from "../../actions/eventsActions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./myCalendar.css";

const MyCalendar = ({ auth, events, getEvent, getAllEvents }) => {
  const [open, setOpen] = useState(false);

  // const temp = localStorage.getItem("id");
  // console.log(temp);
  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  // In your MyCalendar.jsx, modify just the useEffect:
  useEffect(() => {
    if (auth?.user?._id) {  // Add this optional chaining
      getAllEvents(auth.user._id);
    }
  }, [getAllEvents, open, auth?.user?._id]);  // Add optional chaining here too

  const openEventClick = async (event) => {
    // console.log("EVENT : ", event.id);
    await getEvent(event.id);
    setOpen(true);
  };

  // Add at the start of your MyCalendar component, right after const declarations:
if (!auth.user) {
  return (
    <div className="main-calendar">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Loading calendar...
      </div>
    </div>
  );
}

  // const generateGoogleCalendarLink = (event) => {
  //   const { title, start, end, describe } = event;
  //   const startDate = new Date(start)
  //     .toISOString()
  //     .replace(/-|:|\.\d\d\d/g, "");
  //   const endDate = new Date(end).toISOString().replace(/-|:|\.\d\d\d/g, "");
  //   const details = describe ? `&details=${encodeURIComponent(describe)}` : "";
  //   return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  //     title
  //   )}&dates=${startDate}/${endDate}${details}`;
  // };

  return (
    <div className="main-calendar">
      {!open && (
        <div className="button-wrapper">
          <Link to="/events/add">
            <button>Add Event</button>
          </Link>
        </div>
      )}

      {!open && (
        <Calendar
          className="calendar-wrapper"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={(event) => {
            openEventClick(event);
          }}
          defaultView="month"
          views={{ month: true, week: true, day: true }}
        />
      )}

      {open && <Popping open={open} setOpen={setOpen} />}

      {/* Google Calendar Button */}
      {/* {open && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <a
            href={generateGoogleCalendarLink(
              events.find((event) => event.id === open.id)
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 30,
                paddingLeft: 30,
                borderRadius: 8,
                borderWidth: 0,
                cursor: "pointer",
              }}
            >
              Add to Google Calendar
            </button>
          </a>
        </div>
      )} */}
    </div>
  );
};

const mapStateToProps = ({ auth, event, events }) => ({
  auth,
  event,
  events,
});

export default connect(mapStateToProps, {
  getEvent,
  getAllEvents,
})(MyCalendar);

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
import { ShowEventApi, ShowEventsApi } from "../../actions/eventsActions";
import { closeEvent } from "../../actions/modal";

import "react-big-calendar/lib/css/react-big-calendar.css";

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

const MyCalendar = ({ events, ShowEventApi, closeEvent, ShowEventsApi }) => {
  const [open, setOpen] = useState(false);
  const [renderStatus, rerender] = useState(false);

  useEffect(() => {
    ShowEventsApi();
    console.log("i renderd because of refresh or start");
  }, []);

  useEffect(() => {
    ShowEventsApi();
    console.log("i renderd");
  }, [renderStatus]);

  const openEventClick = (event) => {
    setOpen(true);
    if (event.id) {
      ShowEventApi(event.id);
    }
  };

  const closeEventClick = () => {
    setOpen(false);
    setTimeout(() => closeEvent(), 300);
  };

  const generateGoogleCalendarLink = (event) => {
    const { title, start, end, describe } = event;
    const startDate = new Date(start)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(end).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = describe ? `&details=${encodeURIComponent(describe)}` : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}${details}`;
  };

  return (
    <div style={{ marginTop: 80 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Link to="/events/add">
          <button
            style={{
              marginRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 30,
              paddingLeft: 30,
              borderRadius: 8,
              borderWidth: 0,
              cursor: "pointer",
            }}
          >
            Add Event
          </button>
        </Link>
      </div>

      <Popping
        open={open}
        handleOpen={openEventClick}
        handleClose={closeEventClick}
        renderStatus={renderStatus}
        rerender={rerender}
      />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 450, margin: 20 }}
        onSelectEvent={(event) => {
          openEventClick(event);
        }}
        defaultView="month"
        views={{ month: true, week: true, day: true }}
      />

      {/* Google Calendar Button */}
      {open && (
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
      )}
    </div>
  );
};

function mapStateToProps({ event, events }) {
  return {
    event,
    events,
  };
}

export default connect(mapStateToProps, {
  ShowEventApi,
  closeEvent,
  ShowEventsApi,
})(MyCalendar);

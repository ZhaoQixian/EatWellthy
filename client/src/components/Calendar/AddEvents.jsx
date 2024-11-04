import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addEvent } from "../../actions/eventsActions";
import "./addEvent.css";
import "react-datepicker/dist/react-datepicker.css";

const AddEvents = ({ auth, addEvent }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, watch } = useForm({});
  const [errorMessage, setErrorMessage] = useState("");

  const validateFields = (values) => {
    if (!values.title || !values.start || !values.end) {
      setErrorMessage("Please enter the event details first.");
      return false;
    }
    if (values.end < values.start) {
      setErrorMessage('The "End Date" must be later than the "Start Date".');
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const onSubmit = async (values) => {
    if (!validateFields(values)) return;

    try {
      const uploadedData = { ...values, userId: auth.user._id };
      await addEvent(uploadedData);
      navigate("/calendar");
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleCalendar = () => {
    const values = {
      title: watch("title"),
      start: watch("start"),
      end: watch("end"),
      describe: watch("describe"),
    };

    if (!validateFields(values)) return;

    const { title, start, end, describe } = values;
    const startDateTime = new Date(start).toISOString();
    const endDateTime = new Date(end).toISOString();

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(describe)}&dates=${startDateTime.replace(
      /-|:|\.\d{3}/g,
      ""
    )}/${endDateTime.replace(/-|:|\.\d{3}/g, "")}&ctz=Asia/Singapore`;
    window.open(url, "_blank");
  };

  const handleCancel = () => {
    navigate("/calendar");
  };

  return (
    <div className="main-container">
      <div className="wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="event-add">
            <label htmlFor="title" className="title">
              Event
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="title"
              id="title"
              aria-describedby="title"
              className="description text"
            />
          </div>

          <div className="event-add">
            <label htmlFor="describe" className="title">
              Event Description
            </label>
            <textarea
              rows={8}
              wrap="soft"
              className="description text"
              {...register("describe")}
              type="text"
              placeholder="describe your event"
              id="describe"
              aria-describedby="describe"
            />
          </div>

          <div className="event-add">
            <label htmlFor="start" className="title">
              Start Date
            </label>
            <div className="description">
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <DatePicker
                    style={{ zIndex: "99" }}
                    toggleCalendarOnIconClick
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    value={field.value}
                    showTimeSelect
                    timeFormat="h:mm a"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    id="start"
                  />
                )}
              />
            </div>
          </div>

          <div className="event-add">
            <label htmlFor="end" className="title">
              End Date
            </label>
            <div className="description">
              <Controller
                control={control}
                name="end"
                render={({ field }) => (
                  <DatePicker
                    style={{ zIndex: "99" }}
                    toggleCalendarOnIconClick
                    placeholderText="Select end date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    value={field.value}
                    timeFormat="h:mm a"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    id="end"
                  />
                )}
              />
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="event-add">
            <div className="title"></div>
            <div className="description buttons-container">
              <button type="submit">Create</button>
              <button type="button" onClick={handleGoogleCalendar}>
                Add to Google Calendar
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps, { addEvent })(AddEvents);

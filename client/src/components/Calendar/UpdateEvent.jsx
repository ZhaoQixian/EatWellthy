import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAllEvents, updateEvent } from "../../actions/eventsActions";
import "react-datepicker/dist/react-datepicker.css";

const UpdateEvent = ({ updateEvent, event }) => {
  const navigate = useNavigate();

  //using form-hook to register event data
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      title: event.title,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : "",
      describe: event.describe ? event.describe : "No description was provided",
    },
  });

  const onSubmit = async (values) => {
    try {
      if (
        values.title === "" ||
        values.start === undefined ||
        values.end === undefined ||
        values.end < values.start
      ) {
        console.error("Empty fields or incorrect date fields");
        alert(
          `No empty fields for "Event", "Start Date" or "End Date" and "End Date" must be > "Start Date"`
        );
        return;
      }
      const res = await updateEvent(values, event.id);
      console.log("UPDATE event : ", values);
      navigate("/calendar");
    } catch (err) {
      console.error(err);
    }
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
              Event Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="title"
              className="description text"
              id="title"
              aria-describedby="title"
            />
          </div>

          <div className="event-add">
            <label htmlFor="describe" className="title">
              Event Description
            </label>

            <textarea
              rows={8}
              wrap="soft"
              {...register("describe")}
              type="text"
              placeholder="describe your event"
              className="description text"
              id="describe"
              aria-describedby="describe"
            />
          </div>

          <div className="event-add" style={{ zIndex: "100" }}>
            <label htmlFor="start" className="title">
              Start Date
            </label>
            {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
            {/* start date controller*/}
            <div className="description">
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    showTimeSelect
                    timeFormat="h:mm a"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    id="start"
                  />
                )}
              />
            </div>
          </div>

          <div className="event-add" style={{ zIndex: "100" }}>
            <label htmlFor="end" className="title">
              End Date
            </label>
            {/* end date controller*/}
            <div className="description">
              <Controller
                control={control}
                name="end"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select end date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    timeFormat="h:mm a"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    className="form-control"
                    id="end"
                  />
                )}
              />
            </div>
          </div>

          <div className="event-add">
            <div className="title"></div>
            <div className="description">
              <button type="submit">Update</button>
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

const mapStateToProps = ({ event }) => ({
  event,
});

export default connect(mapStateToProps, { updateEvent, getAllEvents })(
  UpdateEvent
);

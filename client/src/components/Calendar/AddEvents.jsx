import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addEvent } from "../../actions/eventsActions";
import "./addEvent.css";
import "react-datepicker/dist/react-datepicker.css";

const AddEvents = ({ auth, addEvent }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm({});

  const onSubmit = async (values) => {
    try {
      // console.log(values);
      // console.log(auth);
      const uploadedData = { ...values, userId: auth.user._id };
      console.log(uploadedData);
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
      const res = await addEvent(uploadedData);
      navigate("/calendar");
    } catch (e) {
      console.error(e);
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
            {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
            {/* start date controller*/}
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
            {/* end date controller*/}
          </div>

          <div className="event-add">
            <div className="title"></div>
            <div className="description">
              <button type="submit">Create</button>
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

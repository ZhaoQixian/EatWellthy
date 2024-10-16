import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
// import { set } from "date-fns";

import { addEventApi } from "../../actions/eventsActions";

//schema to validate event inputs
const schema = yup
  .object({
    title: yup.string().required("Can't Be Empty"),
    start: yup.date().required("Please specify the time to start"),
  })
  .required();

const AddEvents = ({ addEventApi, error }) => {
  const navigate = useNavigate();
  const [rerender, setRerender] = useState(false);
  const [dbError, setError] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (error && !firstRender) {
      setError(error);
    }
    if (!error.start && !error.end && dbError !== false) {
      setTimeout(navigate("/"));
    }
  }, [rerender]);
  //using form-hook to register event data
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    setFirstRender(false);
    addEventApi(values).then(() => {
      setRerender(!rerender);
    });
  };

  return (
    <div
      style={{
        marginTop: 80,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "60%" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ margin: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="title" className="form-label">
              Event Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="title"
              id="title"
              aria-describedby="title"
              style={{ marginLeft: 20, padding: 5 }}
            />
            <p
              className={`error text-warning position-absolute ${
                errors.title ? "active" : ""
              }`}
            >
              {errors.title ? <i className="bi bi-info-circle me-2"></i> : ""}
              {errors.title?.message}
            </p>
          </div>
          <div
            style={{
              zIndex: "100",
              marginBottom: 20,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <label htmlFor="start">Start Date</label>
            {/* controllers are the way you can wrap and use datePicker inside react form-hook*/}
            {/* start date controller*/}
            <div style={{ marginLeft: 20 }}>
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    value={field.value}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    id="start"
                  />
                )}
              />
            </div>

            {/* error handling */}
            <p>
              {errors.start ? <i className=" bi bi-info-circle me-2"></i> : ""}
              {errors.start?.message}
            </p>
            <p>
              {dbError.start ? <i className=" bi bi-info-circle me-2"></i> : ""}
              {dbError.start}
            </p>
          </div>
          <div
            style={{
              zIndex: "100",
              marginBottom: 20,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <label htmlFor="end">End Date</label>
            <div style={{ marginLeft: 20 }}>
              <Controller
                control={control}
                name="end"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select end date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    value={field.value}
                    timeFormat="HH:mm"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    showTimeSelect
                    id="end"
                  />
                )}
              />
            </div>
            {/* end date controller*/}

            <p>
              {dbError.end ? <i className=" bi bi-info-circle me-2"></i> : ""}
              {dbError.end}
            </p>
          </div>
          <div style={{ marginBottom: 40 }}>
            <label htmlFor="describe">
              Event Description
              <span>(optional)</span>
            </label>
            <input
              style={{ marginLeft: 20, padding: 5 }}
              {...register("describe")}
              type="text"
              placeholder="describe your event"
              id="describe"
              aria-describedby="describe"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <button
                type="submit"
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
                Create
              </button>
            </div>
            <div>
              <Link to="/calendar" style={{ marginLeft: 30 }}>
                <button
                  type="button"
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
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

function mapStateToProps({ event, error }) {
  return {
    error,
    // event
  };
}

export default connect(mapStateToProps, { addEventApi })(AddEvents);

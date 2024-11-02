import * as moment from "moment";
import axios from "axios";

const apiCall = axios.create({
  baseURL: "http://localhost:5050/events",
});

export const getEvent = (id) => async (dispatch) => {
  //i won't get the event from redux store as it is safer to
  //keep updated with db.

  try {
    const result = await apiCall.get(`/${id}/show`);
    const { title, _id, start, end, describe } = await result.data;
    const convertedEvent = await {
      title,
      describe,
      id: _id,
      start: moment(start).format("ddd DD MMM YY LT"),
      end: moment(end).format("ddd DD MMM YY LT"),
    };

    dispatch({
      type: "SHOW_EVENT",
      payload: convertedEvent,
    });
  } catch (err) {
    console.log(err.data.message);
  }
};

export const getAllEvents = (id) => async (dispatch) => {
  // console.log("started fetching the api");
  //i won't get the event from redux store as it is safer to
  //keep updated with db.

  try {
    const result = await apiCall.get(`/?id=${id}`);
    const convertedDates = await result.data.map((event) => {
      return {
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        id: event._id,
        describe: event.describe,
      };
    });
    dispatch({
      type: "SHOW_EVENTS",
      payload: convertedDates,
    });
  } catch (err) {
    console.log(err.data.message);
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    const result = await apiCall.delete(`/${id}/delete`);
    console.log("DELETE event : ", id);
  } catch (err) {
    console.error(err);
  }
};

export const addEvent = (values) => async (dispatch) => {
  try {
    const result = await apiCall.post("/", {
      title: values.title,
      start: values.start,
      end: values.end,
      describe: values.describe,
      userId: values.userId,
    });
    console.log("ADD event : ", result.data.data._id);
  } catch (e) {
    console.log(e);
  }
};

export const updateEvent = (values, id) => async (dispatch) => {
  try {
    const result = await apiCall.put(`/${id}/update`, {
      title: values.title,
      start: values.start,
      end: values.end,
      describe: values.describe,
    });
    console.log("UPDATE event: ", result.data);
  } catch (err) {
    console.error(err);
  }
};

export const addGoogleCalendarEvent = (event) => async (dispatch) => {
  try {
    const result = await apiCall.post("/google-calendar", event); // Assuming this route in your backend handles Google Calendar events
    console.log("Google Calendar event added: ", result.data);
  } catch (e) {
    console.log("Error adding Google Calendar event: ", e);
  }
};

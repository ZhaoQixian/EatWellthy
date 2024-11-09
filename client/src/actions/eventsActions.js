import * as moment from "moment";
import axios from "axios";
import config from "../config";

const apiCall = axios.create({
  baseURL: `${config.backendUrl}/events`,  // Fixed template literal syntax
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleError = (err, message = "An error occurred") => {
  console.error(message, err);
  if (err.response && err.response.data) {
    return err.response.data.message || message;
  }
  return message;
};

export const getEvent = (id) => async (dispatch) => {
  try {
    const result = await apiCall.get(`/${id}/show`);
    const { title, _id, start, end, describe } = result.data;
    const convertedEvent = {
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
    handleError(err, "Failed to fetch event");
    dispatch({
      type: "EVENT_ERROR",
      payload: "Failed to fetch event"
    });
  }
};

export const getAllEvents = (id) => async (dispatch) => {
  try {
    const result = await apiCall.get(`/?id=${id}`);
    const convertedDates = result.data.map((event) => ({
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      id: event._id,
      describe: event.describe,
    }));
    
    dispatch({
      type: "SHOW_EVENTS",
      payload: convertedDates,
    });
  } catch (err) {
    handleError(err, "Failed to fetch events");
    dispatch({
      type: "EVENT_ERROR",
      payload: "Failed to fetch events"
    });
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    await apiCall.delete(`/${id}/delete`);
    dispatch({
      type: "DELETE_EVENT",
      payload: id
    });
    return true;
  } catch (err) {
    handleError(err, "Failed to delete event");
    return false;
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
    
    dispatch({
      type: "ADD_EVENT",
      payload: result.data.data
    });
    return result.data.data;
  } catch (err) {
    handleError(err, "Failed to add event");
    return null;
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
    
    dispatch({
      type: "UPDATE_EVENT",
      payload: result.data
    });
    return result.data;
  } catch (err) {
    handleError(err, "Failed to update event");
    return null;
  }
};

export const addGoogleCalendarEvent = (event) => async (dispatch) => {
  try {
    const result = await apiCall.post("/google-calendar", event);
    dispatch({
      type: "ADD_GOOGLE_EVENT",
      payload: result.data
    });
    return result.data;
  } catch (err) {
    handleError(err, "Failed to add Google Calendar event");
    return null;
  }
};

export default {
  getEvent,
  getAllEvents,
  deleteEvent,
  addEvent,
  updateEvent,
  addGoogleCalendarEvent
};
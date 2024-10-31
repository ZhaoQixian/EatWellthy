import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteEvent } from "../../actions/eventsActions";
import "./popping.css";

const Popping = ({ open, setOpen, event, deleteEvent }) => {
  const navigate = useNavigate();
  const { id, describe, title, start, end } = event;
  console.log("ID :", id);

  const handleDelete = async () => {
    await deleteEvent(event.id);
    setOpen(!open);
    navigate("/calendar");
  };

  const handleCancel = () => {
    setOpen(!open);
  };

  return (
    <div className="wrapper">
      <div className="event-item">
        <div className="title">Event type</div>
        <div className="description">{title}</div>
      </div>
      <div className="event-item">
        <div className="title">Description</div>
        <div className="description">
          <textarea rows={10} readOnly={true}>
            {describe}
          </textarea>
        </div>
      </div>
      <div className="event-item">
        <div className="title">Event start</div>
        <div className="description">{start}</div>
      </div>
      <div className="event-item">
        <div className="title">Event end</div>
        <div className="description">{end}</div>
      </div>
      <div className="event-item">
        <button onClick={() => navigate(`/event/${id}/update`)}>Update</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ event }) => ({
  event,
});

export default connect(mapStateToProps, { deleteEvent })(Popping);

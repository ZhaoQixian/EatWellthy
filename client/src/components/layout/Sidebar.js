import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "../../actions/Profile";

// Import all animal icons
import bearIcon from "../../img/bear.png";
import capybaraIcon from "../../img/capybara.png";
import catIcon from "../../img/cat.png";
import dogIcon from "../../img/dog.png";
import otterIcon from "../../img/otter.png";
import pandaIcon from "../../img/panda.png";
import rabbitIcon from "../../img/rabbit.png";
import tigerIcon from "../../img/tiger.png";

const Sidebar = ({ user }) => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const authState = useSelector((state) => state.auth);
  const userId = authState.user._id;

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const animalIcons = {
    bear: bearIcon,
    capybara: capybaraIcon,
    cat: catIcon,
    dog: dogIcon,
    otter: otterIcon,
    panda: pandaIcon,
    rabbit: rabbitIcon,
    tiger: tigerIcon,
  };

  const userIcon = profileState?.profile?.profileIcon
    ? animalIcons[profileState.profile.profileIcon]
    : bearIcon; // Default to bear if no icon is selected

  return (
    <div className="sidebar">
      <div className="profile-section">
        <img src={userIcon} alt="user-icon" className="user-avatar" />
        <p>{user && user.name}</p>
      </div>
      <ul className="menu">
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to={'/nutrition-calculator'}>
            Tracker
          </Link>
        </li>
        <li>
          <Link to="/diet-planner">Analysis</Link>
        </li>
        <li>
          <Link to="/daily-price-list">Grocery</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
        <li>
          <Link to="/faqs">FAQs</Link>
        </li>
        <li>
          <Link to="/location">Location</Link>
        </li>
        <li>
          <Link to="/Welloh" className="wellohli">
            Welloh
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

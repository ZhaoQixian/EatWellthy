import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, generateDietSuggestions } from "../actions/Profile";
import { addEvent, getAllEvents } from "../actions/eventsActions";

const DietSuggestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileState = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profileState.profile && profileState.profile.userId) {
      dispatch(getAllEvents(profileState.profile.userId));
    }
  }, [profileState.profile, dispatch]);

  const handleRefresh = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await dispatch(generateDietSuggestions());
      if (!result) {
        setError("Failed to generate diet plan. Please try again.");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while generating the diet plan"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const validateFields = (values) => {
    if (!values.title || !values.start || !values.end) {
      return { valid: false, message: "Please enter the event details first." };
    }
    if (values.end < values.start) {
      return {
        valid: false,
        message: 'The "End Date" must be later than the "Start Date".',
      };
    }
    return { valid: true };
  };

  const addMealToWebsiteCalendar = async (meal, start, end) => {
    if (!profileState.profile || !auth.user || !auth.user._id) {
      console.error("User ID is not available");
      return;
    }

    const eventDetails = {
      title: meal.meal,
      describe: meal.items
        .map((item) => `${item.food} - ${item.weight}`)
        .join(", "),
      start: start.toISOString(),
      end: end.toISOString(),
      userId: auth.user._id,
    };

    const validation = validateFields(eventDetails);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      await dispatch(addEvent(eventDetails));
      console.log("Event added to website calendar.");
      alert("Event added to website calendar successfully!");

      // Fetch all events to update the calendar
      dispatch(getAllEvents(auth.user._id));

      // Ask if the user wants to add to Google Calendar
      const addToGoogle = window.confirm(
        "Do you want to add this event to Google Calendar?"
      );
      if (addToGoogle) {
        handleGoogleCalendar(eventDetails);
      }
    } catch (error) {
      console.error("Failed to add event to website calendar:", error);
      alert("Failed to add event to website calendar.");
    }
  };

  const handleGoogleCalendar = (eventDetails) => {
    const { title, start, end, describe } = eventDetails;
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

  const handleAddMeal = (meal) => {
    const mealTimes = {
      breakfast: { start: "08:00", end: "09:00" },
      lunch: { start: "12:00", end: "13:00" },
      dinner: { start: "18:00", end: "19:00" },
      snack: { start: "15:00", end: "15:30" },
    };

    const mealTime = mealTimes[meal.meal.toLowerCase()];
    if (mealTime) {
      const today = new Date();
      const startDateTime = new Date(today);
      const endDateTime = new Date(today);

      const [startHour, startMinute] = mealTime.start.split(":");
      const [endHour, endMinute] = mealTime.end.split(":");

      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      return (
        <div className="mt-4">
          <button
            onClick={() =>
              addMealToWebsiteCalendar(meal, startDateTime, endDateTime)
            }
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add to Website Calendar
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {profileState.loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : !profileState.profile ? (
        <div className="text-center py-4">
          Please update your profile to see your nutritional data.
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Diet Plan</h2>
            <button
              onClick={handleRefresh}
              disabled={isGenerating}
              className={`px-4 py-2 bg-red-600 text-white rounded ${
                isGenerating ? "opacity-50" : "hover:bg-red-700"
              }`}
            >
              {isGenerating ? "Generating..." : "Generate New Plan"}
            </button>
          </div>

          {profileState.profile.dietSuggestions?.length > 0 ? (
            <div className="space-y-4">
              {profileState.profile.dietSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-white p-4 rounded shadow">
                  <h3 className="font-bold text-lg text-blue-600">
                    {suggestion.meal}
                  </h3>
                  <div className="mt-2">
                    {suggestion.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between py-1"
                      >
                        <span>{item.food}</span>
                        <span className="text-gray-600">{item.weight}</span>
                      </div>
                    ))}
                  </div>
                  {handleAddMeal(suggestion)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              No diet suggestions available. Click "Generate New Plan" to create
              your personalized diet plan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DietSuggestions;

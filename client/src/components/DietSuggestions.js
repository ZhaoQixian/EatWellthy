import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, generateDietSuggestions } from "../actions/Profile";
import { addEvent, getAllEvents } from "../actions/eventsActions";
import "./DietSuggestions.css";

const DietSuggestions = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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

  const getMealTimes = () => {
    const today = new Date();
    return {
      breakfast: {
        start: new Date(today.setHours(8, 0, 0)),
        end: new Date(today.setHours(9, 0, 0)),
      },
      lunch: {
        start: new Date(today.setHours(12, 0, 0)),
        end: new Date(today.setHours(13, 0, 0)),
      },
      snack: {
        start: new Date(today.setHours(15, 0, 0)),
        end: new Date(today.setHours(15, 30, 0)),
      },
      dinner: {
        start: new Date(today.setHours(18, 0, 0)),
        end: new Date(today.setHours(19, 0, 0)),
      },
    };
  };

  const addToWebsiteCalendar = async (mealType) => {
    if (!profileState.profile || !auth.user || !auth.user._id) {
      console.error("User ID is not available");
      return;
    }

    setIsAdding(true);

    try {
      if (mealType === "wholeDay") {
        // Create one event for whole day
        const mealTimes = getMealTimes();
        const fullDayEvent = {
          title: "Full Day Meal Plan",
          describe: profileState.profile.dietSuggestions
            .map(
              (meal) =>
                `${meal.meal}:\n${meal.items
                  .map((item) => `${item.food} - ${item.weight}`)
                  .join(", ")}`
            )
            .join("\n\n"),
          start: mealTimes.breakfast.start.toISOString(),
          end: mealTimes.dinner.end.toISOString(),
          userId: auth.user._id,
        };

        const validation = validateFields(fullDayEvent);
        if (!validation.valid) {
          throw new Error(validation.message);
        }

        await dispatch(addEvent(fullDayEvent));
        alert("Full day meal plan added to calendar successfully!");
      } else {
        await addSingleMealToCalendar(mealType);
        alert("Meal added to calendar successfully!");
      }

      setShowDialog(false);
      dispatch(getAllEvents(auth.user._id));

      const addToGoogle = window.confirm(
        "Do you want to add this to Google Calendar as well?"
      );
      if (addToGoogle) {
        if (mealType === "wholeDay") {
          // Create one Google Calendar event for whole day
          const mealTimes = getMealTimes();
          const fullDayEvent = {
            title: "Full Day Meal Plan",
            describe: profileState.profile.dietSuggestions
              .map(
                (meal) =>
                  `${meal.meal}:\n${meal.items
                    .map((item) => `${item.food} - ${item.weight}`)
                    .join(", ")}`
              )
              .join("\n\n"),
            start: mealTimes.breakfast.start.toISOString(),
            end: mealTimes.dinner.end.toISOString(),
            userId: auth.user._id,
          };
          handleGoogleCalendar(fullDayEvent);
        } else {
          handleGoogleCalendar(createEventDetails(mealType));
        }
      }
    } catch (error) {
      console.error("Failed to add to calendar:", error);
      alert("Failed to add to calendar.");
    } finally {
      setIsAdding(false);
    }
  };

  const createEventDetails = (mealType) => {
    const mealTimes = getMealTimes();
    const timeSlot = mealTimes[mealType];

    const selectedMeal = profileState.profile.dietSuggestions.find(
      (meal) => meal.meal.toLowerCase() === mealType.toLowerCase()
    );

    if (!selectedMeal) {
      throw new Error("Meal not found");
    }

    return {
      title: selectedMeal.meal,
      describe: selectedMeal.items
        .map((item) => `${item.food} - ${item.weight}`)
        .join(", "),
      start: timeSlot.start.toISOString(),
      end: timeSlot.end.toISOString(),
      userId: auth.user._id,
    };
  };

  const addSingleMealToCalendar = async (mealType) => {
    const eventDetails = createEventDetails(mealType);
    const validation = validateFields(eventDetails);

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    await dispatch(addEvent(eventDetails));
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
          <div className="space-y-4">
            {profileState.profile.dietSuggestions?.length > 0 ? (
              <div className="space-y-4">
                {profileState.profile.dietSuggestions.map(
                  (suggestion, index) => (
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
                            {/* Updated to add spacing between food item and weight */}
                            <span className="flex-1">{item.food}</span>
                            <div></div>
                            <span className="text-gray-600 mt-2 ml-2">
                              Quantity - {item.weight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                <div className="diet-button-container">
                  <button
                    onClick={() => setShowDialog(true)}
                    disabled={isAdding}
                    className="diet-calendar-button"
                  >
                    {isAdding ? "Adding to Calendar..." : "Add to Calendar"}
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={isGenerating}
                    className="diet-calendar-button"
                  >
                    {isGenerating ? "Generating..." : "Generate New Plan"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                No diet suggestions available. Click "Generate New Plan" to
                create your personalized diet plan.
              </div>
            )}

            {/* Calendar Dialog */}
            {showDialog && (
              <div className="diet-modal-overlay">
                <div className="diet-modal">
                  <div className="diet-modal-header">
                    <h3>Add to Calendar</h3>
                    <button
                      className="diet-modal-close"
                      onClick={() => setShowDialog(false)}
                    >
                      ×
                    </button>
                  </div>
                  <button
                    className="diet-calendar-button"
                    onClick={() => addToWebsiteCalendar("wholeDay")}
                    disabled={isAdding}
                  >
                    Add All Meals
                  </button>
                  <button
                    className="diet-calendar-button"
                    onClick={() => addToWebsiteCalendar("breakfast")}
                    disabled={isAdding}
                  >
                    Add Breakfast
                  </button>
                  <button
                    className="diet-calendar-button"
                    onClick={() => addToWebsiteCalendar("lunch")}
                    disabled={isAdding}
                  >
                    Add Lunch
                  </button>
                  <button
                    className="diet-calendar-button"
                    onClick={() => addToWebsiteCalendar("snack")}
                    disabled={isAdding}
                  >
                    Add Snack
                  </button>
                  <button
                    className="diet-calendar-button"
                    onClick={() => addToWebsiteCalendar("dinner")}
                    disabled={isAdding}
                  >
                    Add Dinner
                  </button>
                  <div className="diet-modal-footer">
                    <button
                      className="diet-modal-cancel"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietSuggestions;

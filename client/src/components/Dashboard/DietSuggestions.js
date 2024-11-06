import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getProfile, generateDietSuggestions } from "../../actions/Profile";
import { addEvent, getAllEvents } from "../../actions/eventsActions";
import "./DietSuggestions.css";

const DietSuggestions = ({ setDashboardLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileState = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showMealSelection, setShowMealSelection] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mealDetails, setMealDetails] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profileState.profile && profileState.profile.userId) {
      dispatch(getAllEvents(profileState.profile.userId));
    }
  }, [profileState.profile, dispatch]);

  const handleRefresh = async () => {
    setDashboardLoading(true);
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
      setDashboardLoading(false);
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
        setMealDetails(fullDayEvent);
        setShowSuccessModal(true);
      } else {
        await addSingleMealToCalendar(mealType);
        setMealDetails(createEventDetails(mealType));
        setShowSuccessModal(true);
      }

      setShowDialog(false);
      dispatch(getAllEvents(auth.user._id));
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

  const handleSuccessModalConfirm = () => {
    handleGoogleCalendar(mealDetails);
    setShowSuccessModal(false);
  };

  const handleSuccessModalCancel = () => {
    setShowSuccessModal(false);
  };

  const openMealSelection = () => {
    setShowMealSelection(true);
  };

  const handleMealSelection = (mealType) => {
    setShowMealSelection(false);
    if (mealType) {
      addToWebsiteCalendar(mealType);
    }
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
                {profileState.profile.dietSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white p-4 rounded shadow">
                    <h3 className="font-bold text-lg text-blue-600">
                      {suggestion.meal}
                    </h3>
                    <div className="mt-2">
                      {suggestion.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center py-1">
                          <span className="text-black font-medium">
                            {item.food}
                          </span>
                          <span className="text-gray-600 ml-2">
                            - {item.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No diet suggestions available.</div>
            )}

            {/* Button container at the bottom */}
            <div className="diet-button-container">
              {/* Show Refresh button when length >= 0 */}
              {profileState.profile.dietSuggestions?.length >= 0 && (
                <button
                  onClick={handleRefresh}
                  disabled={isAdding}
                  className="diet-calendar-button"
                >
                  {isAdding ? "Generating..." : "Refresh Diet Suggestions"}
                </button>
              )}
              
              {/* Show Add to Calendar when length > 0 */}
              {profileState.profile.dietSuggestions?.length > 0 && (
                <button
                  onClick={openMealSelection}
                  disabled={isAdding}
                  className="diet-calendar-button"
                >
                  {isAdding ? "Adding to Calendar..." : "Add to Calendar"}
                </button>
              )}
            </div>
          </div>

          {/* Keep modals unchanged */}
          {showSuccessModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Meal Added Successfully!</h2>
                <p>Do you want to add this meal to your Google Calendar?</p>
                <button onClick={handleSuccessModalConfirm}>Yes</button>
                <button onClick={handleSuccessModalCancel}>No</button>
              </div>
            </div>
          )}

          {showMealSelection && (
            <div className="modal">
              <div className="modal-content">
                <h2>Select Meal Type</h2>
                <button onClick={() => handleMealSelection("breakfast")}>
                  Breakfast
                </button>
                <button onClick={() => handleMealSelection("lunch")}>
                  Lunch
                </button>
                <button onClick={() => handleMealSelection("snack")}>
                  Snack
                </button>
                <button onClick={() => handleMealSelection("dinner")}>
                  Dinner
                </button>
                <button onClick={() => handleMealSelection("wholeDay")}>
                  All Meals
                </button>
                <button onClick={() => handleMealSelection(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

DietSuggestions.propTypes = {
  setDashboardLoading: PropTypes.func.isRequired,
};

export default DietSuggestions;
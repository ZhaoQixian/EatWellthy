import React, { useEffect, useState } from "react";
import { getProfile, generateDietSuggestions } from "../actions/Profile";
import { useDispatch, useSelector } from "react-redux";

const DietSuggestions = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleRefresh = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await dispatch(generateDietSuggestions());
      console.log("Generation result:", result);
      if (!result) {
        setError("Failed to generate diet plan. Please try again.");
      }
    } catch (err) {
      console.error("Diet generation error:", err);
      setError(err.message || "An error occurred while generating the diet plan");
    } finally {
      setIsGenerating(false);
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Diet Plan</h2>
            <button
              onClick={handleRefresh}
              disabled={isGenerating}
              className={`px-4 py-2 bg-red-600 text-white rounded 
                ${isGenerating ? 'opacity-50' : 'hover:bg-red-700'}`}
            >
              {isGenerating ? 'Generating...' : 'Generate New Plan'}
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
                      <div key={itemIndex} className="flex justify-between py-1">
                        <span>{item.food}</span>
                        <span className="text-gray-600">{item.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              No diet suggestions available. Click "Generate New Plan" to create your personalized diet plan.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DietSuggestions;
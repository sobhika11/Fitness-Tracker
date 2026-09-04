import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const getMealPlan = async (mealType) => {
  try {
    // 1. Get the user's location using browser's geolocation API
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Detected coordinates: Latitude ${lat}, Longitude ${lon}`);

    // 2. Convert latitude and longitude into a city name using OpenCage API
    const openCageApiKey = 'YOUR_OPENCAGE_API_KEY'; // Replace with actual key
    const geoResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}`);

    if (!geoResponse.ok) {
      throw new Error('Failed to fetch location data from geocoding API.');
    }

    const geoData = await geoResponse.json();

    const city = geoData.results[0]?.components?.city
      || geoData.results[0]?.components?.town
      || geoData.results[0]?.components?.village
      || "Unknown Location";

    console.log(`Detected City: ${city}`);

    if (city === "Unknown Location") {
      throw new Error('Could not determine city from coordinates.');
    }

    // 3 & 4. Send a POST request to the backend API with the city and meal_type
    const mealPlanResponse = await fetch('http://localhost:5001/api/mealplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        city: city,
        meal_type: mealType
      })
    });

    if (!mealPlanResponse.ok) {
      throw new Error(`Backend API error! status: ${mealPlanResponse.status}`);
    }

    // 5 & 6. Handle the result and log it
    const mealPlanData = await mealPlanResponse.json();
    console.log('Successfully fetched meal plan:', mealPlanData);

    return mealPlanData;

  } catch (error) {
    // 6. Handle errors properly and log results in console
    console.error('Error fetching meal plan:', error.message);
    return null;
  }
};

const MealPlanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState("breakfast");
  const [mealImages, setMealImages] = useState({});
  const [city, setCity] = useState("");
  const [goal, setGoal] = useState("Healthy Living");
  const [weather, setWeather] = useState("moderate");
  const [temp, setTemp] = useState("25");

  const [mealsByType, setMealsByType] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: "skipped",
    lunch: "skipped",
    dinner: "skipped",
  });

  const [savedMealNames, setSavedMealNames] = useState({
    breakfast: "Not selected yet",
    lunch: "Not selected yet",
    dinner: "Not selected yet",
  });

  const [nutritionTotals, setNutritionTotals] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [loadingRecommend, setLoadingRecommend] = useState(false);
  const [savingMeals, setSavingMeals] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navLinks = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" },
    { title: "Exercise", path: "/exercise" },
  ];

  const mealTabs = ["breakfast", "lunch", "dinner"];

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const today = new Date().toISOString().split("T")[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchMealTypeData = async (mealType) => {
    setLoadingMeals(true);
    setError("");

    try {
      // adaptable try set
      const possibleUrls = [
        `${API_BASE_URL}/api/meals/meal_type?meal_type=${mealType}${city ? `&city=${encodeURIComponent(city)}` : ""}`,
        `${API_BASE_URL}/api/meals/${mealType}${city ? `?city=${encodeURIComponent(city)}` : ""}`,
        `${API_BASE_URL}/api/meals/meal_type/${mealType}${city ? `?city=${encodeURIComponent(city)}` : ""}`,
      ];

      let data = [];

      for (const url of possibleUrls) {
        try {
          const res = await fetch(url, { headers: getAuthHeaders() });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json)) {
              data = json;
              break;
            }
          }
        } catch {
          // ignore and try next
        }
      }

      setMealsByType((prev) => ({
        ...prev,
        [mealType]: data,
      }));
    } catch (err) {
      setError("Failed to load meals");
    } finally {
      setLoadingMeals(false);
    }
  };

  const fetchSavedLog = async () => {
    const userId = storedUser?.id;
    if (!userId) return;

    const possibleUrls = [
      `${API_BASE_URL}/api/meals/log/${userId}`,
      `${API_BASE_URL}/api/meals/log/userId`,
    ];

    for (const url of possibleUrls) {
      try {
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();

          setSavedMealNames({
            breakfast: data.meals?.breakfast || "Not selected yet",
            lunch: data.meals?.lunch || "Not selected yet",
            dinner: data.meals?.dinner || "Not selected yet",
          });

          setNutritionTotals({
            totalCalories: data.totalCalories || 0,
            totalProtein: data.totalProtein || 0,
            totalCarbs: data.totalCarbs || 0,
            totalFat: data.totalFat || 0,
          });

          break;
        }
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    if (!storedUser?.id) {
      navigate("/login");
      return;
    }
    fetchSavedLog();
  }, [navigate, storedUser]);

  useEffect(() => {
    fetchMealTypeData(activeTab);
  }, [activeTab]);

  const handleSelectMeal = (mealType, mealId, mealFood) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealType]: mealId,
    }));

    setSavedMealNames((prev) => ({
      ...prev,
      [mealType]: mealFood,
    }));

    setSuccess("");
    setError("");
  };

  const handleRecommend = async () => {
    setLoadingRecommend(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/meals/recommend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          goal,
          weather,
          temp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get recommendation");
      }

      setRecommendation(data);
      setSuccess("Recommended meals loaded");
    } catch (err) {
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoadingRecommend(false);
    }
  };

  const handleSaveSelection = async () => {
    const userId = storedUser?.id;
    if (!userId) return;

    setSavingMeals(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/meals/select`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          date: today,
          breakfast: selectedMeals.breakfast,
          lunch: selectedMeals.lunch,
          dinner: selectedMeals.dinner,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save meal selection");
      }

      setNutritionTotals({
        totalCalories: data.totalCalories || 0,
        totalProtein: data.totalProtein || 0,
        totalCarbs: data.totalCarbs || 0,
        totalFat: data.totalFat || 0,
      });

      setSavedMealNames({
        breakfast: data.meals?.breakfast || savedMealNames.breakfast,
        lunch: data.meals?.lunch || savedMealNames.lunch,
        dinner: data.meals?.dinner || savedMealNames.dinner,
      });

      setSuccess("Meals saved successfully");
    } catch (err) {
      setError(err.message || "Failed to save meals");
    } finally {
      setSavingMeals(false);
    }
  };

  const fetchMealImage = async (query) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query,
        )}&per_page=1&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`,
      );

      const data = await res.json();
      return data.results?.[0] || null;
    } catch (err) {
      console.error("Meal image fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const loadMealImages = async () => {
      const images = {};

      for (const type of ["breakfast", "lunch", "dinner"]) {
        for (const meal of mealsByType[type] || []) {
          const key = meal._id || meal.food;

          if (!images[key]) {
            const photo = await fetchMealImage(`${meal.food} food`);

            if (photo) {
              images[key] = {
                url: photo.urls.small,
                author: photo.user.name,
                link: photo.user.links.html,
              };
            }
          }
        }
      }

      setMealImages(images);
    };

    loadMealImages();
  }, [mealsByType]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-content-wrap">
        <header className="app-topbar">
          <div className="app-brand">FITSYNC</div>

          <nav className="app-topnav">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-topnav-link ${location.pathname === item.path ? "app-topnav-active" : ""
                  }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <button className="app-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="dashboard-main">
          <div className="mealplanner-header">
            <div>
              <p className="dashboard-greeting">Meal Planner</p>
              <h1>Eat smart, stay consistent</h1>
              <p className="dashboard-email">
                Pick your meals, get AI recommendations, and save today’s plan.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>Plan Date</span>
              <strong>{today}</strong>
            </div>
          </div>

          {(error || success) && (
            <div
              className={`mealplanner-alert ${error ? "mealplanner-error" : "mealplanner-success"
                }`}
            >
              {error || success}
            </div>
          )}

          <section className="mealplanner-top-grid">
            <div className="mealplanner-recommend-card">
              <div className="section-head">
                <h3>AI Recommendation</h3>
                <span>Smart suggestions</span>
              </div>

              <div className="mealplanner-form-grid">
                <input
                  className="mealplanner-input"
                  type="text"
                  placeholder="City (optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <select
                  className="mealplanner-input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option>Healthy Living</option>
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Fat Loss</option>
                </select>

                <select
                  className="mealplanner-input"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option value="moderate">Moderate</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                  <option value="rainy">Rainy</option>
                </select>

                <input
                  className="mealplanner-input"
                  type="text"
                  placeholder="Temperature"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                />
              </div>

              <button
                className="mealplanner-primary-btn"
                onClick={handleRecommend}
              >
                {loadingRecommend ? "Loading..." : "Get Recommendations"}
              </button>

              <div className="mealplanner-recommend-grid">
                {["breakfast", "lunch", "dinner"].map((type) => (
                  <div key={type} className="mealplanner-mini-card">
                    <p className="meal-type-label">{type}</p>
                    <h4>
                      {recommendation?.[type]?.food || "No suggestion yet"}
                    </h4>
                    <span>{recommendation?.[type]?.calories ?? 0} kcal</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mealplanner-summary-card">
              <div className="section-head">
                <h3>Nutrition Totals</h3>
                <span>Saved plan</span>
              </div>

              <div className="meal-summary-row">
                <p>Calories</p>
                <strong>{nutritionTotals.totalCalories} kcal</strong>
              </div>
              <div className="meal-summary-row">
                <p>Protein</p>
                <strong>{nutritionTotals.totalProtein} g</strong>
              </div>
              <div className="meal-summary-row">
                <p>Carbs</p>
                <strong>{nutritionTotals.totalCarbs} g</strong>
              </div>
              <div className="meal-summary-row">
                <p>Fat</p>
                <strong>{nutritionTotals.totalFat} g</strong>
              </div>

              <button
                className="mealplanner-secondary-btn"
                onClick={handleSaveSelection}
              >
                {savingMeals ? "Saving..." : "Save Selected Meals"}
              </button>
            </div>
          </section>

          <section className="mealplanner-selected-strip">
            <div className="selected-pill">
              <span>Breakfast</span>
              <strong>{savedMealNames.breakfast}</strong>
            </div>
            <div className="selected-pill">
              <span>Lunch</span>
              <strong>{savedMealNames.lunch}</strong>
            </div>
            <div className="selected-pill">
              <span>Dinner</span>
              <strong>{savedMealNames.dinner}</strong>
            </div>
          </section>

          <section className="mealplanner-list-card">
            <div className="section-head">
              <h3>Available Meals</h3>
              <span>Choose by type</span>
            </div>

            <div className="meal-tabs">
              {mealTabs.map((tab) => (
                <button
                  key={tab}
                  className={`meal-tab-btn ${activeTab === tab ? "meal-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loadingMeals ? (
              <div className="dashboard-message-card">Loading meals...</div>
            ) : mealsByType[activeTab]?.length === 0 ? (
              <div className="dashboard-message-card">
                No meals available for {activeTab}.
              </div>
            ) : (
              <div className="meal-cards-grid">
                {mealsByType[activeTab].map((meal, index) => (
                  <div
                    key={meal._id || `${meal.food}-${index}`}
                    className={`meal-food-card ${selectedMeals[activeTab] === meal._id
                      ? "meal-food-card-selected"
                      : ""
                      }`}
                  >
                    <div
                      className="meal-food-image-wrap"
                      style={{
                        backgroundImage: mealImages[meal._id || meal.food]?.url
                          ? `url(${mealImages[meal._id || meal.food].url})`
                          : "url('/meals.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="meal-food-image-badge">{activeTab}</div>
                    </div>

                    <div className="meal-food-content">
                      <h4>{meal.food}</h4>
                      <p>{meal.serving_size}</p>

                      {mealImages[meal._id || meal.food] && (
                        <p
                          style={{
                            fontSize: "12px",
                            margin: "6px 0",
                            color: "#6b4a3f",
                          }}
                        >
                          Photo by{" "}
                          <a
                            href={mealImages[meal._id || meal.food].link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {mealImages[meal._id || meal.food].author}
                          </a>{" "}
                          on Unsplash
                        </p>
                      )}

                      <div className="meal-food-macros">
                        <span>{meal.calories} kcal</span>
                        <span>P {meal.protein}</span>
                        <span>C {meal.carbs}</span>
                        <span>F {meal.fat}</span>
                      </div>

                      <button
                        className="meal-card-select-btn"
                        onClick={() =>
                          handleSelectMeal(activeTab, meal._id, meal.food)
                        }
                      >
                        Select for {activeTab}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default MealPlanner;

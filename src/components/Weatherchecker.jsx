import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import loadingGif from "../assets/images/loading.gif";
import { useState, useEffect, useCallback } from "react";


const Weatherchecker = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const api_key = import.meta.env.VITE_API_KEY;

  const fetchWeather = useCallback(async (city, signal) => {
    setLoading(true);
    setError("");

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=Metric&appid=${api_key}`;
      const response = await fetch(url, { signal });
      const weatherData = await response.json();

      if (!response.ok || weatherData.cod !== 200) {
        setData({ notFound: true });
        return false;
      }

      setData(weatherData);
      return true;
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError("Unable to load weather right now. Please try again.");
      }
      return false;
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [api_key]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWeather("Peshawar", controller.signal);

    return () => controller.abort();
  }, [fetchWeather]);

  const search = async () => {
    const city = location.trim();
    if (city && !loading) {
      const didFindWeather = await fetchWeather(city);
      if (didFindWeather) {
        setLocation("");
      }
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
  };

  const weatherImage = data.weather
    ? weatherImages[data.weather[0].main]
    : null;

  const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d64, #71eeec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #57d64, #71eeec)",
    Mist: "linear-gradient(to right, #57d64, #71eeec)",
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : "linear-gradient(to right, #5bc8fb, #80eaff)";

  const currentDate = new Date();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Ju",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();

  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{
          backgroundImage:
            backgroundImage && backgroundImage.replace
              ? backgroundImage.replace("to right", "to top")
              : null,
        }}
      >
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data.name}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter City"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Search by city"
            />
            <button
              className="search-button"
              type="button"
              onClick={search}
              disabled={loading || !location.trim()}
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        {loading ? (<img className="loader" src={loadingGif} alt="Loading weather" />) : error ? (
          <div className="not-found" role="alert">{error}</div>
        ) : data.notFound ? (
          <div className="not-found">Not Found 😒</div>
        ) : (
          <>
            <div className="weather">
              <img src={weatherImage} alt="weather" />
              <div className="weather-type">
                {data.weather ? data.weather[0].main : null}
              </div>
              <div className="temp">
                {data.main ? `${Math.floor(data.main.temp)}°` : null}
              </div>
            </div>
            <div className="weather-date">
              <p>{formattedDate}</p>
            </div>
            <div className="feels-like">
              <p>Feels Like {data.main ? `${Math.floor(data.main.feels_like)}°` : null}</p>
            </div>
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">
                  {data.main ? data.main.humidity : null}
                </div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">
                  {data.wind ? data.wind.speed : null} km/h
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weatherchecker;

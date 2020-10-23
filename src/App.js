import React, { useState, useEffect, Fragment } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import date from "date-and-time";
import { BoxLoading } from "react-loadingg";
import WeekCard from "./components/WeekCard/WeekCard/WeekCard";

// images
import glass from "./img/icons/glass.svg";
import sunrise from "./img/icons/sunrise.svg";
import sunset from "./img/icons/sunset.svg";
import humidity from "./img/icons/humidity.svg";
import presure from "./img/icons/presure.svg";
import eye from "./img/icons/eye.svg";
import wind from "./img/icons/wind.svg";

import "./App.css";

function App() {
  const [center, SetCenter] = useState(["", ""]);
  const [isLoading, SetIsLoading] = useState(true);
  const [weather, SetWeather] = useState(null);
  const [search, setSearch] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const pattern = date.compile("dddd, MMM DD YYYY");
  const hour = date.compile("hh:mm:ss");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function ({ coords }) {
      const { latitude, longitude } = coords;
      SetCenter([latitude, longitude]);

      const cityUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d1285d79a6b1469885375e8776600430`;
      const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=part,hourly&appid=523830cdf94ec06b2206382dbf593518`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          SetWeather(result);
          return fetch(cityUrl).then((response) =>
            response.json().then((result) => {
              console.log("city", result);
              console.log(result.results[0].formatted);
              setcurrentCity(result.results[0].formatted);
              SetIsLoading(false);
            })
          );
        });
    });
  }, []);

  const handleSearch = (e) => {
    // get the longitude and latitude
    e.preventDefault();
    const geoApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${search}&key=d1285d79a6b1469885375e8776600430`;
    var geometry = null;
    fetch(geoApiUrl)
      .then((response) => response.json())
      .then((result) => {
        // get the weather

        const { lat, lng } = result.results[0].geometry;
        SetCenter([lat, lng]);
        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&exclude=part,hourly&appid=523830cdf94ec06b2206382dbf593518`;
        return fetch(apiUrl);
      })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        SetWeather(result);
        setSearch("");
        const cityUrl = `https://api.opencagedata.com/geocode/v1/json?q=${result.lat}+${result.lon}&key=d1285d79a6b1469885375e8776600430`;
        return fetch(cityUrl);
      })
      .then((response) => response.json())
      .then((result) => {
        setcurrentCity(result.results[0].formatted);
      })
      .catch((error) => alert("please enter a valid city or country name"));
  };

  return (
    <div className="App">
      {isLoading ? (
        <BoxLoading size="large" />
      ) : (
        <div className="container">
          <div className="App__left">
            <img
              className="icon"
              src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
              alt="weather icon"
            ></img>
            <h4>{weather.current.weather[0].description}</h4>
            <h1>{weather.current.temp} &#x2103;</h1>
            <h4 className="date">
              {date.format(new Date(weather.current.dt * 1000), pattern)}
            </h4>
            <h5>{currentCity}</h5>
            <div className="App__left_params">
              <div>
                <img className="icon" src={sunrise} />
                <h5>
                  Sunrise{" "}
                  <span className="light">
                    {date.format(
                      new Date(weather.current.sunrise * 1000),
                      hour
                    )}
                  </span>
                </h5>
              </div>
              <div>
                <img className="icon" src={sunset} />
                <h5>
                  Sunset{" "}
                  <span className="light">
                    {date.format(new Date(weather.current.sunset * 1000), hour)}
                  </span>
                </h5>
              </div>
              <div>
                <img className="icon" src={presure} />

                <h5>
                  Presure
                  <span className="light"> {weather.current.pressure}</span>
                </h5>
              </div>
              <div>
                <img className="icon" src={humidity} />
                <h5>
                  Humidity{" "}
                  <span className="light"> {weather.current.humidity}</span>
                </h5>
              </div>
              <div>
                <img className="icon" src={eye} />
                <h5>
                  Visibility{" "}
                  <span className="light"> {weather.current.visibility}</span>
                </h5>
              </div>
              <div>
                <img className="icon" src={wind} />
                <h5>
                  Wind speed {"  "}
                  <span className="light">{weather.current.wind_speed}</span>
                </h5>
              </div>
            </div>
          </div>
          <div className="App__right">
            <div className="seach--bare">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for city or country..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <button type="submit">
                  <img
                    src={glass}
                    onClick={handleSearch}
                    className="icon"
                  ></img>
                </button>
              </form>
            </div>
            <h5 className="title">This Week </h5>
            <div className="App__right__week">
              {weather.daily.map((day) => (
                <WeekCard
                  key={day.dt}
                  dt={day.dt}
                  icon={day.weather[0].icon}
                  temperature={day.temp.day}
                />
              ))}
            </div>
            <h5 className="title">Location</h5>
            <Map center={center} zoom={12}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </Map>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import WeekCard from "./components/WeekCard/WeekCard/WeekCard";

//third party packages
import { Map, TileLayer } from "react-leaflet";
import date from "date-and-time";
import { BoxLoading } from "react-loadingg";

// images
import glass from "./img/icons/glass.svg";
import sunrise from "./img/icons/sunrise.svg";
import sunset from "./img/icons/sunset.svg";
import humidity from "./img/icons/humidity.svg";
import presure from "./img/icons/presure.svg";
import eye from "./img/icons/eye.svg";
import wind from "./img/icons/wind.svg";

// Styles
import "./App.css";

function App() {
  const [center, SetCenter] = useState(["", ""]);
  const [isLoading, SetIsLoading] = useState(true);
  const [weather, SetWeather] = useState(null);
  const [search, setSearch] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const pattern = date.compile("dddd, MMM DD YYYY");

  // fetch the weather info from the api
  const getWeather = async (lat, long) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=part,hourly&appid=523830cdf94ec06b2206382dbf593518`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  };

  // get the latitude and longitude based on city,country name

  const getLocation = async (name) => {
    const geoApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${name}&key=d1285d79a6b1469885375e8776600430`;
    const response = await fetch(geoApiUrl);
    const data = await response.json();
    return data;
  };

  // get the exact place name based on longitude and latitude

  const getPlaceName = async (lat, long) => {
    const placeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=d1285d79a6b1469885375e8776600430`;
    const response = await fetch(placeUrl);
    const data = await response.json();
    return data.results[0].formatted;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function ({ coords }) {
      const { latitude, longitude } = coords;
      // set the location in the map
      SetCenter([latitude, longitude]);
      // get the weather infos
      getWeather(latitude, longitude)
        .then((weather) => SetWeather(weather))
        .then(() => {
          // get the place name
          getPlaceName(latitude, longitude).then((place) => {
            setcurrentCity(place);
            SetIsLoading(false);
          });
        })
        .catch((error) => console.log(error));
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // get the longitude and latitude
    getLocation(search)
      .then((result) => {
        const { lat, lng } = result.results[0].geometry;
        // set the place in the map
        SetCenter([lat, lng]);
        // get the weather
        getWeather(lat, lng).then((weather) => SetWeather(weather));
        //get the exact location
        getPlaceName(lat, lng).then((place) => setcurrentCity(place));
      })
      .then(setSearch(""))
      .catch((error) => {
        console.log(error);
        alert("Please enter a valid city or country name");
      });
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
                    {new Date(
                      weather.current.sunrise * 1000
                    ).toLocaleTimeString()}
                  </span>
                </h5>
              </div>
              <div>
                <img className="icon" src={sunset} />
                <h5>
                  Sunset{" "}
                  <span className="light">
                    {new Date(
                      weather.current.sunset * 1000
                    ).toLocaleTimeString()}
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

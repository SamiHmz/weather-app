import React from "react";
import date from "date-and-time";
import "./WeekCard.css";

function WeekCard({ dt, icon, temperature }) {
  const pattern = date.compile(" MMM DD ");

  return (
    <div className="week__card">
      <h5>{date.format(new Date(dt * 1000), pattern)}</h5>
      <img
        className="icon"
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      ></img>
      <h5>{temperature} &#x2103;</h5>
    </div>
  );
}

export default WeekCard;

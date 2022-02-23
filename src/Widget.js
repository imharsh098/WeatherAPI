import React, { useState } from "react";
import search from "./search.png";
import axios from "axios";
import "./Widget.css";
const Widget = () => {
  const [weatherData, setWeatherData] = useState({
    mainTemp: "",
    min: "",
    max: "",
    feelsLike: "",
    humidity: "",
    windSpeed: "",
    visibility: "",
    city: "",
  });
  const [clock, setClock] = useState({
    time: "",
    hour: "",
    minute: "",
    dayOfWeek: "",
    dayOfMonth: "",
    month: "",
  });
  const [searchModal, setModal] = useState(false);

  const [location, setLocation] = useState("");
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getCityWeather = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=a426dd50b8b4887bd4328c35f555359f`;
    const { data } = await axios.get(url);
    setWeatherData({
      mainTemp: Math.round(data.main.temp),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
      feelsLike: Math.round(data.main.feels_like),
      humidity: Math.round(data.main.humidity),
      windSpeed: Math.round(data.wind.speed),
      visibility: Math.round(data.visibility / 1000),
      city: location,
    });
  };
  const getCityTime = async () => {
    let url = `https://timezone.abstractapi.com/v1/current_time/?api_key=3833118c05c5443aa1ec7aeef74b2948&location=${location}`;

    const { data } = await axios.get(url);
    // splitting time value & date
    let time;
    const tempHour = new Date(data.datetime).getHours();
    switch (true) {
      case tempHour > 4 && tempHour < 12:
        time = "MORNING";
        break;
      case tempHour > 12 && tempHour < 18:
        time = "NOON";
        break;
      case tempHour > 18 && tempHour < 21:
        time = "EVENING";
        break;
      case tempHour > 21 || tempHour < 4:
        time = "NIGHT";
    }
    setClock({
      time,
      dayOfMonth: new Date(data.datetime).getDate(),
      hour: new Date(data.datetime).getHours(),
      minute: new Date(data.datetime).getMinutes(),
      month: months[new Date(data.datetime).getMonth()],
      dayOfWeek: weekday[new Date(data.datetime).getDay()],
    });
  };
  return (
    <div className="container">
      <div className="screen">
        <div className="nav">
          <i id="bugerBar" className="fa fa-bars fa-2x"></i>
          <p id="location">{weatherData.city || `PARIS`}</p>
          <img
            src={search}
            id="search"
            alt=""
            onClick={() => {
              setModal(true);
            }}
          />
        </div>
        <div className="data-box">
          <div className="widget">
            <div className="clock">
              <div id="hour">{`${clock.hour}`.padStart(2, "0") || `10`}</div>
              <div className="colon">:</div>
              <div id="minute">{clock.minute || 40}</div>
            </div>
            <div className="date">
              <span id="weekday">{clock.dayOfWeek || `Thursday`}, </span>
              <span id="month">
                {clock.month} {clock.dayOfMonth}
              </span>
            </div>
          </div>
          <div id="main">
            <div className="temp">
              <div id="prime-temp">{weatherData.mainTemp || `21`}&#176;</div>
              <span id="up">&#9652;</span>
              <span id="max">{weatherData.max || `22`}</span>
              <span id="down">&#9662;</span>
              <span id="min">{weatherData.min || `19`}</span>
            </div>
            <div className="details">
              <p className="head">DETAILS</p>
              <div className="detail">
                <span className="detail-tag">FEELS LIKE</span>
                <span className="detail-info" id="temp-like">
                  {weatherData.feelsLike || `21`}&#176;
                </span>
              </div>
              <div className="detail">
                <span className="detail-tag">HUMIDITY</span>
                <span className="detail-info" id="humid">
                  {weatherData.humidity || `10`}%
                </span>
              </div>
              <div className="detail">
                <span className="detail-tag">WIND</span>
                <span className="detail-info" id="wind">
                  {weatherData.windSpeed || `7`}km/h
                </span>
              </div>
              <div className="detail">
                <span className="detail-tag">VISIBILTY</span>
                <span className="detail-info" id="visible">
                  {weatherData.visibility || `21`}km
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="day-time" id="day">
            {clock.dayOfWeek || `SUNDAY`}
          </div>
          <div className="day-time" id="time">
            {clock.time || `MORNING`}
          </div>
        </div>
        <div
          className="city"
          id="modal"
          style={searchModal ? { display: "block" } : { display: "none" }}
        >
          <div className="inpDiv">
            <input
              id="city"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            <button
              id="btn"
              onClick={() => {
                if (location) {
                  getCityTime();
                  getCityWeather();
                }
                setModal(false);
              }}
            >
              GO!
            </button>
          </div>
        </div>
      </div>
      <div className="thumb"></div>
    </div>
  );
};

export default Widget;

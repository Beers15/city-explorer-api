const axios = require('axios');
const cache = require('../cache');

class Forecast {
  constructor(low_temp, high_temp, weatherDescription, date) {
    this.description = 'Low of ' + low_temp + ', high of ' + high_temp + ', with ' + weatherDescription;
    this.date = date;
  }
}

const fetchWeather = async (req, res) => {
  const query = req.query.lat + req.query.lon;

  /*If cached, if our cache entry is older than 10 minutes, don't use the value from
    the cache, otherwise send the value from cache and don't obtain from API */
  if(cache[query] && (((Date.now() - cache[query].time) / 1000) < 360)) {
    cache.time = Date.now();
    console.log('Weather cache hit');
    res.send(cache[query]);
    return;
  } else {
    console.log('Weather cache miss');
  }

  const API = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}`;

  let matches = await axios.get(API).then(res => {
    return res.data;
  }).catch(err => {
    sendErrorResult(res, err.response.status);
  });
  if(!matches) {
    return;
  }

  const forecasts = matches.data.map(entry => {
    return new Forecast(entry.low_temp, entry.high_temp, entry.weather.description, entry.datetime);
  });

  //update cache with successful movie query
  cache[query] = { forecasts };
  cache[query].time = Date.now();

  res.send({
    forecasts
  });
};

const sendErrorResult = (res, statusCode) => {
  return res.status(statusCode).send({'error': 'Unable to fetch weather data for the given location. Please try a different location.'});
};

module.exports = {
  fetchWeather
};

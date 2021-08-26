const axios = require('axios');

class Forecast {
  constructor(low_temp, high_temp, weatherDescription, date) {
    this.description = 'Low of ' + low_temp + ', high of ' + high_temp + ', with ' + weatherDescription;
    this.date = date;
  }
}

const fetchWeather = async (req, res) => {
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

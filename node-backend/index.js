const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT || 3001;

class Forecast {
  constructor(low_temp, high_temp, weatherDescription, date) {
    this.description = 'Low of ' + low_temp + ', high of ' + high_temp + ', with ' + weatherDescription;
    this.date = date;
  }
}

app.get('/weather', async (req, res) => {
  const API = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}`;

  let matches = await axios.get(API).then(res => {
    return res.data;
  }).catch(() => {
    sendErrorResult(res);
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
});

const sendErrorResult = (res) => {
  return res.status(500).send({'error': 'Unable to fetch weather forecasts for the given location. Please try a different location to recieve weather data.'});
};

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

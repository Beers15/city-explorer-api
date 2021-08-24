const express = require('express');
const app = express();
const weatherData = require('./data/weather.json');
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

app.get('/weather', (req, res) => {
  const weatherEntries = weatherData.find(element => {
    if(element.city_name.toLowerCase() === req.query.searchQuery) {
      return element;
    }
    else if(element.lat === req.query.lat && element.lon === req.query.lon) {
      return element;
    }
  });

  if(!weatherEntries) {
    res.send({err: 'The entered values did not match any city with forecastable weather.'});
  } else {
    const forecasts = weatherEntries.data.map(entry => {
      return new Forecast(entry.low_temp, entry.high_temp, entry.weather.description, entry.datetime);
    });
    res.send({
      forecasts
    });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

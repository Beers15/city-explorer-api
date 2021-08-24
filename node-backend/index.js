const express = require('express');
const app = express();
const weatherData = require('./data/weather.json');
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT || 3001;

app.get('/weather', (req, res) => {
  const entry = weatherData.find(element => {
    if(element.city_name.toLowerCase() === req.query.searchQuery) {
      return element;
    }
    else if(element.lat === req.query.lat && element.lon === req.query.lon) {
      return element;
    }
  });

  if(!entry) {
    res.send({err: 'The entered values did not match any city with forecastable weather.'});
  } else {
    res.send({
      description: 'Low of ' + entry.data[0].low_temp + ', high of ' + entry.data[0].high_temp
                             + ', with ' + entry.data[0].weather.description,
      date: entry.data[0].datetime,
    });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

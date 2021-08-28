const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3001;

const { fetchMovies } = require('./services/movies.js');
const { fetchWeather } = require('./services/weather.js');
const { fetchRestaurants } = require('./services/yelp.js');

app.get('/weather', fetchWeather);
app.get('/movies', fetchMovies);
app.get('/yelp', fetchRestaurants);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

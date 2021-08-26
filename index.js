const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3001;

const { fetchMovies } = require('./movies.js');
const { fetchWeather } = require('./weather.js');

app.get('/weather', fetchWeather);
app.get('/movies', fetchMovies);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

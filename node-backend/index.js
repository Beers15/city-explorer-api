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

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.average_votes;
    this.total_views = movieObj.total_views;
    this.image_url = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/' + movieObj.image_url;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.released_on;
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

app.get('/movies', async (req, res) => {
  const API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${req.query.query}`;

  let matches = await axios.get(API).then(res => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    sendErrorResult(res);
  });
  if(!matches) {
    //if a successful axios call doesn't return any results
    sendErrorResult(res);
  }

  let movies = matches.results.map(movie => {
    const movieObj = {
      title: movie.title,
      overview: movie.overview,
      average_votes: movie.vote_average,
      total_views: movie.vote_count,
      image_url: movie.poster_path,
      popularity: movie.popularity,
      released_on: movie.release_date
    };

    return new Movie(movieObj);
  });

  movies = movies.slice(0, 20);
  res.send({
    movies
  });
});

const sendErrorResult = (res) => {
  return res.status(500).send({'error': 'Unable to fetch data for the given location. Please try a different location.'});
};

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

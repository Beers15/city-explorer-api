const axios = require('axios');

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

const fetchMovies = async (req, res) => {
  const API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${req.query.query}`;

  if(req.query.query === '') {
    return sendErrorResult(res, 404);
  }

  let matches = await axios.get(API).then(res => {
    return res.data;
  }).catch((err) => {
    console.log(err);
    return sendErrorResult(res, err.response.status);

  });
  if(matches.results.length === 0) {
    //if a successful axios call doesn't return any results
    return sendErrorResult(res, 404);
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
};

const sendErrorResult = (res, statusCode) => {
  return res.status(statusCode).send({'error': 'Unable to fetch movie data for the given location. Please try a different location.'});
};

module.exports = {
  fetchMovies
};

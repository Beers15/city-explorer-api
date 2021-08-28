const axios = require('axios');
const cache = require('../cache');

class Restaurant {
  constructor(restaurantObj) {
    this.name = restaurantObj.name;
    this.image_url = restaurantObj.image_url;
    this.price = restaurantObj.price;
    this.rating = restaurantObj.rating;
  }
}

const fetchRestaurants = async (req, res) => {
  const query = req.query.query + 'restaurants';

  /*If cached, if our cache entry is older than 10 minutes, don't use the value from
    the cache, otherwise send the value from cache and don't obtain from API */
  if(cache[query] && (((Date.now() - cache[query].time) / 1000) < 360)) {
    cache.time = Date.now();
    console.log('Restaurant cache hit');
    res.send(cache[query]);
    return;
  } else {
    console.log('Restaurant cache miss');
  }

  if(!query) {
    return sendErrorResult(res, 404);
  }

  const API = `https://api.yelp.com/v3/businesses/search?location=${query}`;
  const header = {
    headers: { 'Authorization': `Bearer ${process.env.YELP_API_KEY}`}
  };

  let matches;
  try {
    matches = await axios.get(API, header);
  } catch(err) {
    //console.log(err);
    return sendErrorResult(res, err.response.status);

  }
  if(matches.data.length === 0) {
    //if a successful axios call doesn't return any results
    return sendErrorResult(res, 404);
  }

  let restaurants = matches.data.businesses.map(restaurant => {
    const restaurantObj = {
      name: restaurant.name,
      image_url: restaurant.image_url,
      price: restaurant.price,
      rating: restaurant.rating,
    };

    return new Restaurant(restaurantObj);
  });

  //update cache with successful movie query
  cache[query] = { restaurants };
  cache[query].time = Date.now();

  restaurants = restaurants.slice(0, 20);
  res.send({
    restaurants
  });
};

const sendErrorResult = (res, statusCode) => {
  return res.status(statusCode).send({'error': 'Unable to fetch Restaurant data for the given location. Please try a different location.'});
};

module.exports = { fetchRestaurants };

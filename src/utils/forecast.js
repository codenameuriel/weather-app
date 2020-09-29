// Weather API - Weatherstack

const request = require('request');

const weatherAPIKey = 'c15cb55427fdacbe3d1538cb26d1907f&query=07621';

// destructure the geocode object to extract specific values for http request
const forecast = ({ latitude, longitude }, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${weatherAPIKey}&query=${latitude},${longitude}&units=f`;

  // destructure response to access the body property
  request({ url, json: true }, (error, { body }) => {
    const responseError = body.error;

    if (error) {
      callback('Unable to connect to weather services.', undefined);
    } else if (responseError) {
      callback('Unable to find weather for search. Try another search.', undefined);
    } else {
      const { temperature, feelslike: feelsLike, weather_descriptions: weatherDescription } = body.current;

      callback(undefined, {
        temperature,
        feelsLike,
        weatherDescription: weatherDescription[0]
      });
    }
  });
};

module.exports = forecast;

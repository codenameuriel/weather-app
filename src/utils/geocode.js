// Geocoding API - Mapbox 

const request = require('request');

const geocodingAuthToken = 'pk.eyJ1IjoiY29kZW5hbWV1cmllbCIsImEiOiJja2Y5M2RsZngwNGs2MnlwN3l2YmpmemJxIn0.gEXlz1onqX_dNroeZDwEow';

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${geocodingAuthToken}&limit=1`;

  // encodeURIComponent handles special strings like spaces, ?, etc and converts them to appropriate URL formatting

  // destructure the response object to obtain the body property
  request({ url, json: true }, (error, { body }) => {
    const responseError = body.features.length === 0;

    if (error) {
     // handles errors at a lower level like network connectivity issues
     callback('Unable to connect to location services.', undefined);
    } else if (responseError) {
      // handles errors at a higher level like user typos, etc
      callback('Unable to find location. Try another search.', undefined);
    } else {
      const { center, place_name: location } = body.features[0];
      const latitude = center[1];
      const longitude = center[0];

      callback(undefined, {
        latitude,
        longitude,
        location
      });
    }
  });
};

module.exports = geocode;

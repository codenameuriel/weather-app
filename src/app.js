const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// __dirname, __filename are provided by express
console.log(__dirname);
console.log(path.join(__dirname)); // produces same path as __dirname
console.log(path.join(__dirname, '../public'));

const app = express();
// store Heroku port, or port 3001 for local use
const port = process.env.PORT || 3001;
const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../templates/views'); // by default, when using a template engine, uses a views directory at the level of src or public
// this directory is renamed to templates and Node is configured to allow for this change
const partialsDir = path.join(__dirname, '../templates/partials');

// setting up Node to work with handlebars as the template engine
app.set('view engine', 'hbs');
app.set('views', viewsDir); // configure views directory to template directory
hbs.registerPartials(partialsDir); // configure hbs to use partials by providing path to partials directory

// customize server to serve assets in public directory
// will override the route handler (controller in Rails) for the root route because what is being served is index.html -> special name, served by default on root route
// app.use will still serves any assets that exist within the public directory even if the root route is served dynamically using a template engine and a route handler (controller in Rails)
// express.static takes a path argument
app.use(express.static(publicDir)); // replaced by dynamic handlebars file

// Route Handlers 

// to configure the server to handle resources at specific url routes
// first argument takes in a route name
// ** leave blank for root route
// ** serves not purpose since server has been configured to serve index.html on root route
app.get('', (req, res) => {
  // callback will handle what to do when someone visits the route
  // receives two arguments, the request and response objects

  // render allows to render a template
  // second argument for render is the values for the specified view to access
  // argument is an object
  res.render('index', {
    title: 'Weather',
    name: 'Uriel Rodriguez'
  }); // string name of the view file needs to match up as the file name
});

// set up another get function call for another route
// app.get('/help', (req, res) => {
//   // serving JSON
//   // send an object or array of data and Express will detect it and stringify it for us
//   res.send({
//     name: 'Uriel',
//     age: 31
//   });
// });

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    message: 'You can find answers to any issues on this page.',
    name: 'Uriel Rodriguez'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Page',
    name: 'Uriel Rodriguez'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address.'
    });
  }

  geocode(req.query.address, (error, geocodeData) => {
    if (error) {
     return res.send({error});
    }

    // destructure the forecast data that is returned when successful
    forecast(geocodeData, (error, { 
      temperature, feelsLike, weatherDescription 
    }) => {
      if (error) {
        return res.send({error});
      }

      res.send({
        location: geocodeData.location,
        forecast: {
          temperature,
          feelsLike,
          weatherDescription,
        },
        address: req.query.address
      });
    });
  });
});

// more specific 404 handling for specified route
app.get('/help/*', (req, res) => {
  res.render('404-error', {
    message: 'Help article not found',
    name: 'Uriel Rodriguez',
    title: '404'
  });
});

// handle all other request not specified as routes
// utilizes the wild card character
app.get('*', (req, res) => {
  res.render('404-error', {
    message: 'Page not found',
    name: 'Uriel Rodriguez',
    title: '404'
  });
});

// start the server up
// only used once
// takes a port as an argument - 3000 is a common local development port
// can also pass a callback which will execute when server is up and running
// starting up server is an asynchronous process
app.listen(port, () => {
  console.log('Server is up on port ' + port);
  
  // node application will not stop running unless explicitly instructed to
});

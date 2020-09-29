console.log('Client side JS file is loaded');

// client side JS
// use fetch - client-side API 
// fetch is not accessible in Node but since this file is a JS client-side, it will execute fetch

// ** fetch is able to get data because server side route has created the route which returns JSON of either data or error


// then can be chained to the res.json call instead of the 'then' call
// example of how fetch API works
// fetch('http://puzzle.mead.io/puzzle').then(res => {
//   res.json().then(data => {
//     console.log(data);
//   });
// });

// client-side making API request
// fetch('http://localhost:3001/weather?address=boston').then(res => {
//   res.json().then(data => {
//     if (data.error) console.log(data.error);
//     else console.log(data);
//   });
// });

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', event => {
  event.preventDefault();

  // url will now append route to what ever the domain is to work with Heroku server or localhost
  const location = search.value;
  const url = `/weather?address=${location}`;
  messageOne.textContent = 'Getting weather...';
  messageTwo.textContent = '';

  fetch(url).then(res => {
    res.json().then(data => {
      if (data.error) messageOne.textContent = data.error;
      else {
        messageOne.textContent = data.location + '.'; 
        messageTwo.textContent = 'It\'s ' + data.forecast.temperature + ' degrees, and ' + data.forecast.weatherDescription + '.';
      }
      
    });
  });

  // clear input field
  search.value = '';
});

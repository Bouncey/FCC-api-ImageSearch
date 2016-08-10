const database = require('./database');
const express = require('express');
const rest = require('./rest');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 8000;

dotenv.load();

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/api/search', (req, res) => {
  var searchTerm = req.path.replace(/^\//, '');
  var offset = req.query.offset;
  var options = {
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.API_KEY
    },
    host: 'api.cognitive.microsoft.com',
    path: `/bing/v5.0/images/search?q=${searchTerm}&offset=${offset}`,
    method: "GET"
  };
  rest.getJSON(options, ((err, response) => {
    if (err) {
      console.error(err.stack);
      res.status(500).send(`From rest callback: ${err}`);
    } else {
      var images = response.value.map(image => {
        return `{pageUrl: ${image.contentUrl}, altText: ${image.name}, ` +
        `pageUrl: ${image.hostPageUrl}}`;
      });
      res.status(200).send(images);
      database.storeSearch(searchTerm, err => {
        console.error('Error storing search', err);
      });
    }
  }));
});
app.use('/api/latest', (req, res) => {
  database.lastSearches((err, searches) => {
    if (err) {
      console.error('There was an issue finding the latest searches ', err);
      res.status(500).send(`<h1>Internal Server Error</h1><br/><br/>
        <p>More detail available in the console</p>`);
    } else {
      res.status(200).send(searches);
    }
  });
});
app.use('*', (req, res) => {
  res.render("index");
});

app.listen(port);

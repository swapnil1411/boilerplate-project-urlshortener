require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let counter = 0;
const urlDatabase = [];
app.post('/api/shorturl', (req, res) => {
  const  longUrl  = req.body.url;
  const urlPattern = /^https?:\/\/www\..+\..+/;

  if (!urlPattern.test(longUrl)) {
    return res.json({"error":"Invalid URL"});
  }

  const shortCode = counter++;
  urlDatabase[shortCode] = longUrl;
  const shortUrl = `${req.protocol}://${req.get('host')}/api/shorturl/${shortCode}`;
  res.json({ shortUrl });
});

app.get('/api/shorturl/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;

  if (urlDatabase[shortCode]) {
    res.redirect(301, urlDatabase[shortCode]);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// In-memory store for shortened URLs
const urlMapping = {};

// Generate a random short URL (you can improve this logic)
const generateShortUrl = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';
    for (let i = 0; i < 6; i++) {
        shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortUrl;
};

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust the path if necessary
});

// Handle URL shortening
app.post('/shorten', (req, res) => {
    const longUrl = req.body.url;
    const shortUrl = generateShortUrl();

    // Store the mapping
    urlMapping[shortUrl] = longUrl;

    res.send(`Shortened URL: <a href="/${shortUrl}">http://localhost:${port}/${shortUrl}</a>`);
});

// Redirect to the original URL
app.get('/:shortUrl', (req, res) => {
    const longUrl = urlMapping[req.params.shortUrl];
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

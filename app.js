require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// set dns to solve node.js issue on connecting to mongodb
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

// express app
const app = express();

// connect to mongodb
const dbURI = process.env.MONGODB_BLOG_URI;
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// listen for request
// app.listen(3000);

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    // console.log('new request made');
    // console.log('host: ', req.hostname);
    // console.log('path: ', req.path);
    // console.log('method: ', req.method);
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    // res.send('<h1>About</h1>');
    res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})
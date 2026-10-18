const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// set dns to solve node.js issue on connecting to mongodb
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://sagit:sagit123@nodetuts.ufpaznn.mongodb.net/node-tuts';
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
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        });
})

// add blog to database
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

// get blog details by id then send to frontend
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch(err => {
            console.log(err);
        });
});

// delete blog
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' })
        })
        .catch(err => console.log(err));
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
})

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})
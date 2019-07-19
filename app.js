const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const methodOverride = require('method-override');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/videoNotes')
.then(()=> console.log('mongo connected'))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = bodyParser.json();
app.use(methodOverride('_method'));

//Get all ideas
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort(({date: 'desc'}))
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

//Add one entry
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit one entry
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    });
});
//Delete one entry
app.get('/ideas/delete/:id', (req, res)=> {
    Idea.findOneAndDelete({
        _id: req.params.id
    }).then(idea=> {
        res.redirect('/ideas');
    });
});

//Home Page
app.get('/', (req, res) => {
    const title = "Hi there";
    // console.log(req.name);
    res.render('index', {
        title: title
    });
});

//About page
app.get('/about', (req, res) => {
    res.render('about');
});

//Page with list of ideas
app.post('/ideas', (req, res) => {
    const newUser = {
        title: req.body.title,
        details: req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea=> {
        res.redirect('/ideas');
    })
});

//Update Idea
app.put('/ideas/:id', (req, res) => {
   Idea.findOne({
       _id: req.params.id
    })
   .then(idea => {
       idea.title = req.body.title;
       idea.details = req.body.details;
       
       idea.save()
       .then(idea=>{
           res.redirect('/ideas');
       })
    });
});


const port = 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});


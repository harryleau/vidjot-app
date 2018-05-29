const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB connected...'))
  .catch(e => console.log(e));

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override -> so forms can use put, delete methods
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// connect-flash middleware to show instant message
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.get('/', (req, res) => {
  const title = 'welcome';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`starting up on port ${port}`);
}); 